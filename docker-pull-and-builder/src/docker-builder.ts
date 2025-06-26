import Docker from "dockerode";
import path from "path";
import fs from "fs";
import { uploadFile } from "./aws";
import { PassThrough } from "stream";

const docker = new Docker();

export async function buildProject(id: string) {
    const projectPath = path.resolve("output", id);
    
    try {
        // Pull the image
        await new Promise((resolve, reject) => {
            docker.pull("node:18", {}, (err, stream) => {
                if (err) return reject(err);
                if (!stream) return reject(new Error("No stream returned from docker pull"));
                
                docker.modem.followProgress(stream, (err: any) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
        });

        // Create and start container
        const container = await docker.createContainer({
            Image: "node:18",
            Cmd: ["bash", "-c", "ls && npm install && npm run build && chown -R 1000:1000 /app"],
            Tty: false,
            WorkingDir: "/app",
            HostConfig: {
                Binds: [`${projectPath}:/app`],
                AutoRemove: true
            }
        });

        // Capture container output
        const stream = await container.attach({ stream: true, stdout: true, stderr: true });
        stream.pipe(process.stdout);

        await container.start();
        const result = await container.wait();

        if (result.StatusCode !== 0) {
            throw new Error(`Docker build failed with code ${result.StatusCode}`);
        }

        return "Build successful";
    } catch (error) {
        console.error("Build failed:", error);
        throw error; // Re-throw to let caller handle it
    }
}

export async function copyFinalDist(id: string) {
    const projectPath = path.resolve("output", id);
    const folderPath = path.resolve("output", id, "dist");

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