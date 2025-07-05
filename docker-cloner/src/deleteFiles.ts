import path from "path";
import fs from "fs/promises";
import { getAllFiles } from "./file";

export async function deleteAllFiles(folderPath: string): Promise<void> {
  const allFiles = await getAllFiles(folderPath);

  // Delete all files in parallel
  await Promise.all(allFiles.map(file => fs.unlink(file)));

  // Recursively delete all empty folders
  async function deleteFolders(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await deleteFolders(fullPath);
      }
    }
    await fs.rmdir(dir);
  }

  await deleteFolders(folderPath);

  console.log(`Deleted all files and folders in ${folderPath}`);
}
