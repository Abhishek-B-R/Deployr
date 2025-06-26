"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = buildProject;
exports.copyFinalDist = copyFinalDist;
const dockerode_1 = __importDefault(require("dockerode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const aws_1 = require("./aws");
const docker = new dockerode_1.default();
function buildProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = path_1.default.resolve("output", id);
        try {
            // Pull the image
            yield new Promise((resolve, reject) => {
                docker.pull("node:18", {}, (err, stream) => {
                    if (err)
                        return reject(err);
                    if (!stream)
                        return reject(new Error("No stream returned from docker pull"));
                    docker.modem.followProgress(stream, (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(null);
                    });
                });
            });
            // Create and start container
            const container = yield docker.createContainer({
                Image: "node:18",
                Cmd: ["bash", "-c", "ls && npm install && npm run build"],
                Tty: false,
                WorkingDir: "/app",
                HostConfig: {
                    Binds: [`${projectPath}:/app`],
                    AutoRemove: true
                }
            });
            // Capture container output
            const stream = yield container.attach({ stream: true, stdout: true, stderr: true });
            stream.pipe(process.stdout);
            yield container.start();
            const result = yield container.wait();
            if (result.StatusCode !== 0) {
                throw new Error(`Docker build failed with code ${result.StatusCode}`);
            }
            return "Build successful";
        }
        catch (error) {
            console.error("Build failed:", error);
            throw error; // Re-throw to let caller handle it
        }
    });
}
function copyFinalDist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = path_1.default.resolve("output", id);
        const folderPath = path_1.default.resolve("output", id, "dist");
        try {
            if (!fs_1.default.existsSync(folderPath)) {
                throw new Error(`Build output directory not found at ${folderPath}`);
            }
            const allFiles = getAllFiles(folderPath);
            yield Promise.all(allFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                const s3Key = `dist/${id}/` + file.slice(folderPath.length + 1);
                yield (0, aws_1.uploadFile)(s3Key, file);
            })));
            return "Upload successful";
        }
        catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    });
}
function getAllFiles(folderPath) {
    let allPaths = [];
    if (!fs_1.default.existsSync(folderPath)) {
        return allPaths;
    }
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            allPaths = allPaths.concat(getAllFiles(fullFilePath));
        }
        else {
            allPaths.push(fullFilePath);
        }
    });
    return allPaths;
}
