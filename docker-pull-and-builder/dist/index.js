"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { PrismaClient } from "../generated/prisma";
const path_1 = __importDefault(require("path"));
const deleteLocalFiles_1 = require("./deleteLocalFiles");
// async function  main() {
//     // while(1){
//         console.log("Hey this function started working")
const response = {
    element: "5m184"
}; // change this
console.log(response);
// if(response===null) return
const id = response.element;
//         // await prismaClient.websites.create({
//         //     data:{
//         //         websiteId:id,
//         //         websiteName:id,
//         //         email
//         //     }
//         // })
//         await downloadS3Folder(`output/${id}`)
//         console.log("downloaded")
//         await buildProject(id)
//         copyFinalDist(id)
//         //insert status in hashset of redis
//         console.log(path.join("output",id))
//         // delete all files used for the process
//         await deleteAllFilesFromR2(path.join("output",id))
(0, deleteLocalFiles_1.deleteAllFiles)(path_1.default.resolve("output", id));
// }
// }
// main()
