import Docker from "dockerode";
import path, { resolve } from "path";
import fs from "fs";
import { uploadFile } from "./aws";
import { broadcastLog } from "./websocketServer";
import pgClient from "./db";
import {exec} from "child_process"

const docker = new Docker();

function normalizeRootDirectory(rootDirectory: string): string {
    return (rootDirectory || ".")
        .trim()
        .replace(/^\.\/+/, "")
        .replace(/\/+$/, "");
}

export async function buildProject(id: string,rootDirectory: string, installCommand: string, buildCommand: string,envVarsArray?: { key: string, value: string }[]) {
    const outputBasePath = process.env.OUTPUT_BASE_PATH || path.resolve("output");
    const projectPath = path.join(outputBasePath, id);
    const cleanedRoot = normalizeRootDirectory(rootDirectory);
    const workingDir = cleanedRoot ? path.posix.join("/app", cleanedRoot) : "/app";
    let logsList = ""

    async function log(msg: string) {
        logsList += msg + "\n";
        console.log(msg);
        broadcastLog(id, msg);
        await new Promise(resolve => {
            // Wait for 1.5 second to let logs react frontend
            setTimeout(() => {
                resolve(null);
            }, 1500);
        });
    }

    function sanitizeLogs(logs:string): string {
        if (typeof logs !== "string") return "";
        // Remove null bytes
        let cleaned = logs.replace(/\x00/g, "");
        // Optionally remove other non-printable ASCII (0x01-0x1F), except \n and \t
        cleaned = cleaned.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
        return cleaned;
    }


    try {
        await new Promise(resolve => {
            // Wait for 1 second to ensure Docker is ready
            setTimeout(() => {
                log("Docker is ready");
                resolve(null);
            }, 2000);
        });
        log("Pulling node:18 image...");

        await new Promise((resolve, reject) => {
            try{
                docker.pull("node:18", {}, (err, stream) => {
                    if (err) return reject(err);
                    if (!stream) return reject(new Error("No stream returned from docker pull"));

                    docker.modem.followProgress(stream, (err: any) => {
                        if (err) reject(err);
                        else resolve(null);
                    }, (event: any) => {
                        if (event.status) log(`[pull] ${event.status}`);
                    });
                });
            }catch(err){
                log(`Error pulling image: ${err}`);
                log("Restarting Docker service...");
                exec("sudo systemctl restart docker", (error, stdout, stderr) => {
                    if (error) {
                        log(`Error restarting Docker: ${error.message}`);
                        return reject(error);
                    }
                    log("Docker service restarted successfully");
                    // Retry pulling the image after restarting Docker
                    docker.pull("node:18", {}, (err, stream) => {
                        if (err) return reject(err);
                        if (!stream) return reject(new Error("No stream returned from docker pull"));

                        docker.modem.followProgress(stream, (err: any) => {
                            if (err) reject(err);
                            else resolve(null);
                        }, (event: any) => {
                            if (event.status) log(`[pull] ${event.status}`);
                        });
                    });
                });
            }
        });

        log("Creating and starting container...");

        const packageJsonPath = cleanedRoot
            ? path.join(projectPath, cleanedRoot, "package.json")
            : path.join(projectPath, "package.json");
        if (!fs.existsSync(packageJsonPath)) {
            throw new Error(
                `package.json not found at ${packageJsonPath}. Check OUTPUT_BASE_PATH bind mount (host files must be under ${projectPath}).`
            );
        }

        const container = await docker.createContainer({
            Image: "node:18",
            Cmd: [
                "bash",
                "-c",
                `${installCommand} && ${buildCommand} && chown -R 1000:1000 /app`
            ],
            Tty: false,
            WorkingDir: workingDir,
            Env: envVarsArray?.map(({ key, value }) => `${key}=${value}`),
            HostConfig: {
                Binds: [`${projectPath}:/app`],
                AutoRemove: true
            }
        });

        const stream = await container.attach({ stream: true, stdout: true, stderr: true });

        stream.on("data", (chunk: Buffer) => {
            log(chunk.toString());
        });

        await container.start();
        const result = await container.wait();

        if (result.StatusCode !== 0) {
            log(`Build failed with status code ${result.StatusCode}`);
            throw new Error(`Docker build failed with code ${result.StatusCode}`);
        }

        log("Build successful");

        // let all these be prineted on frontend via websockets
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return "Build successful";
    } catch (error) {
        log(`Build error: ${error}`);
        throw error;
    }finally{
        //save logs in database
        logsList = sanitizeLogs(logsList);
        await pgClient.query(`UPDATE "Project" SET logs = $1 WHERE id = $2`, [logsList, id]);
    }
}

export async function copyFinalDist(
  id: string,
  rootDirectory: string,
  outputDirectory: string
): Promise<number> {
  const cleanedRoot = normalizeRootDirectory(rootDirectory);
  const folderPath = path.resolve(
    "output",
    id,
    cleanedRoot || ".",
    outputDirectory
  );

  try {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Build output directory not found at ${folderPath}`);
    }

    const allFiles = getAllFiles(folderPath);

    let totalBytes = 0;

    await Promise.all(
      allFiles.map(async (file) => {
        const stat = await fs.promises.stat(file);
        totalBytes += stat.size;

        const s3Key = `dist/${id}/` + file.slice(folderPath.length + 1);
        await uploadFile(s3Key, file);
      })
    );

    console.log(`✅ Uploaded ${allFiles.length} files (${totalBytes} bytes)`);
    return totalBytes; 
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

function getAllFiles(folderPath: string): string[] {
    let allPaths: string[] = [];

    if (!fs.existsSync(folderPath)) {
        return allPaths;
    }

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            allPaths = allPaths.concat(getAllFiles(fullFilePath));
        } else {
            allPaths.push(fullFilePath);
        }
    });

    return allPaths;
}
