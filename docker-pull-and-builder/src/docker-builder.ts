import Docker from "dockerode";
import path from "path";
import fs from "fs";
import { uploadFile } from "./aws";
import { broadcastLog } from "./websocketServer";
import pgClient from "./db";

const docker = new Docker();

export async function buildProject(id: string,rootDirectory: string, installCommand: string, buildCommand: string,envVarsArray?: { key: string, value: string }[]) {
    const projectPath = path.resolve("output", id);
    let logsList = ""

    function log(msg: string) {
        logsList += msg + "\n";
        console.log(msg);
        broadcastLog(id, msg);
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
            }, 5000);
        });
        log("Pulling node:18 image...");

        await new Promise((resolve, reject) => {
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

        log("Creating and starting container...");

        const container = await docker.createContainer({
            Image: "node:18",
            Cmd: [
                "bash",
                "-c",
                `${installCommand} && ${buildCommand} && chown -R 1000:1000 /app`
            ],
            Tty: false,
            WorkingDir: `/app/${rootDirectory}`,
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

export async function copyFinalDist(id: string, rootDirectory: string, outputDirectory: string) {
    const folderPath = path.resolve("output", id, rootDirectory, outputDirectory);

    try {
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Build output directory not found at ${folderPath}`);
        }

        const allFiles = getAllFiles(folderPath);
        await Promise.all(allFiles.map(async file => {
            const s3Key = `dist/${id}/` + file.slice(folderPath.length + 1);
            await uploadFile(s3Key, file);
        }));

        return "Upload successful";
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
