import path from "path";
import fs from "fs";

export function getAllFiles(folderPath:string){
    let allPaths:string[]=[];

    const allFilesAndFolders=fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath=path.join(folderPath,file)
        if(fs.statSync(fullFilePath).isDirectory()){
            allPaths=allPaths.concat(getAllFiles(fullFilePath))
        }else{
            allPaths.push(fullFilePath)
        }
    })
    return allPaths
}
// TODO: make this function async

export function deleteAllFiles(folderPath: string): void {
    const allFiles = getAllFiles(folderPath);

    allFiles.forEach(filePath => {
        fs.unlinkSync(filePath);
    });

    const deleteFolders = (folder: string) => {
        const contents = fs.readdirSync(folder);
        contents.forEach(item => {
            const fullPath = path.join(folder, item);
            if (fs.statSync(fullPath).isDirectory()) {
                deleteFolders(fullPath); // recurse into subfolder
            }
        });
        fs.rmdirSync(folder);
    };

    deleteFolders(folderPath);
    console.log(`Deleted all files and folders in ${folderPath}`);
}