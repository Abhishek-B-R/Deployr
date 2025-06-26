"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = getAllFiles;
exports.deleteAllFiles = deleteAllFiles;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getAllFiles(folderPath) {
    let allPaths = [];
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
// TODO: make this function async
function deleteAllFiles(folderPath) {
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(filePath => {
        fs_1.default.unlinkSync(filePath);
    });
    const deleteFolders = (folder) => {
        const contents = fs_1.default.readdirSync(folder);
        contents.forEach(item => {
            const fullPath = path_1.default.join(folder, item);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                deleteFolders(fullPath); // recurse into subfolder
            }
        });
        fs_1.default.rmdirSync(folder);
    };
    deleteFolders(folderPath);
    console.log(`Deleted all files and folders in ${folderPath}`);
}
