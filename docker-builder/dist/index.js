"use strict";
// import express from "express"
// import cors from "cors"
// import simpleGit from "simple-git"
// import { generate } from "./utils"
// import path from "path"
// import { getAllFiles } from "./file"
// import { uploadFile } from "./aws"
// import { deleteAllFiles } from "./delete"
// // import { clerkClient } from "@clerk/express";
// import axios from "axios"
// import dotenv from "dotenv"
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app=express()
// app.use(cors())
// app.use(express.json())
// app.get("/",(req,res)=>{
//     res.json({
//         msg:"hey this is working"
//     })
// })
// app.post("/deploy",async (req,res)=>{
//     const repoURL=req.body.data.repoURL
//     const emailObj=req.body.data.email
//     const email=emailObj[0].emailAddress
//     const id=generate()
//     //clone data from url and get all file paths and omit all folder names
//     await simpleGit().clone(repoURL,path.join(__dirname,`output/${id}`))
//     const files=getAllFiles(path.join(__dirname,`output/${id}`))
//     //put this in s3
//     files.forEach(async file=>{
//         await uploadFile(file.slice(__dirname.length+1),file)
//     })
//     console.log("All files uploaded successfully")
//     await new Promise((resolve) => setTimeout(resolve, 5000))
//     //push to redis queue
//     //insert status in hashset of redis
//     //delete content of dist/output folder
//     deleteAllFiles(path.join(__dirname,"output",id))
//     res.json({
//         id
//     })
// })
// app.get("/status",async (req,res)=>{
//     const id=req.query.id
//     // const response=await subscriber.hGet("status",id as string)
//     res.json({
//         // status:response
//     })
// })
// // const getGithubAccessToken = async (userId: string) => {
// //     const user = await clerkClient.users.getUser(userId);
// //     const githubAccount = user.externalAccounts.find(
// //         (acc) => acc.provider === "oauth_github"
// //     );
// //     if (!githubAccount) {
// //         return undefined;
// //     }
// //     // Try different possible locations for the token
// //     const token = (githubAccount as any)?.access_token || 
// //                     (githubAccount as any)?.token?.access_token ||
// //                     (githubAccount as any)?.oauthAccessToken;
// //     return token;
// // };
// // app.get("/api/github-repos", async (req, res) => {
// //     const userId = req.header("x-user-id"); // sent from frontend via useUser()
// //     if (!userId) {
// //      res.status(401).send("Missing user ID");
// //      return
// //     }    
// //     const token = await getGithubAccessToken(userId);
// //     if (!token) {
// //         res.status(403).send("GitHub not connected");
// //         return
// //     }
// //     const repos = await axios.get("https://api.github.com/user/repos", {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         Accept: "application/vnd.github+json",
// //       },
// //     });
// //     res.json(repos.data);
// //   });
// app.listen(8080)
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.R2_ENDPOINT);
