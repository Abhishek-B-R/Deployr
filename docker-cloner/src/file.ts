import fs from "fs/promises";
import path from "path";

export async function getAllFiles(folderPath: string): Promise<string[]> {
  let allPaths: string[] = [];

  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath);
      allPaths = allPaths.concat(subFiles);
    } else {
      allPaths.push(fullPath);
    }
  }

  return allPaths;
}