import path from "path";
import fs from "fs";
import { getAllFiles } from "./file";

/**
 * Recursively deletes all files and folders in a given folder.
 * @param folderPath - The root folder path to clean up.
 */
export function deleteAllFiles(folderPath: string): void {
    const allFiles = getAllFiles(folderPath);

    // Step 1: Delete all files
    allFiles.forEach(filePath => {
        fs.unlinkSync(filePath);
    });

    // Step 2: Recursively delete all folders (starting from deepest)
    const deleteFolders = (folder: string) => {
        const contents = fs.readdirSync(folder);
        contents.forEach(item => {
            const fullPath = path.join(folder, item);
            if (fs.statSync(fullPath).isDirectory()) {
                deleteFolders(fullPath); // recurse into subfolder
            }
        });
        fs.rmdirSync(folder); // delete folder after its contents
    };

    deleteFolders(folderPath);

    console.log(`Deleted all files and folders in ${folderPath}`);
}