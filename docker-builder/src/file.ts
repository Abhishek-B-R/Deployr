import fs from "fs"
import path from "path"

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
