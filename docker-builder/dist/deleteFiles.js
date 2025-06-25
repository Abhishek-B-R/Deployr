"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllFiles = deleteAllFiles;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const file_1 = require("./file");
/**
 * Recursively deletes all files and folders in a given folder.
 * @param folderPath - The root folder path to clean up.
 */
function deleteAllFiles(folderPath) {
    const allFiles = (0, file_1.getAllFiles)(folderPath);
    // Step 1: Delete all files
    allFiles.forEach(filePath => {
        fs_1.default.unlinkSync(filePath);
    });
    // Step 2: Recursively delete all folders (starting from deepest)
    const deleteFolders = (folder) => {
        const contents = fs_1.default.readdirSync(folder);
        contents.forEach(item => {
            const fullPath = path_1.default.join(folder, item);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                deleteFolders(fullPath); // recurse into subfolder
            }
        });
        fs_1.default.rmdirSync(folder); // delete folder after its contents
    };
    deleteFolders(folderPath);
    console.log(`Deleted all files and folders in ${folderPath}`);
}
