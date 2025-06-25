import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import path from "path"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws"
import { deleteAllFiles } from "./deleteFiles"
import dotenv from "dotenv"
dotenv.config();

const app=express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.json({
        msg:"hey this is working"
    })
})

app.post("/deploy",async (req,res)=>{
    const {
      id,
      repository,
      branch,
      session
    } = req.body;

    const repo_url = `https://${repository.split("/")[0]}:${session.accessToken}@github.com/${repository}.git`
    console.log(repo_url)
    //clone data from url and get all file paths and omit all folder names
    await simpleGit().clone(repo_url, path.join(__dirname, `output/${id}`), ['--branch', branch, '--depth', '1'])
    const files=getAllFiles(path.join(__dirname,`output/${id}`))
    
    //put this in s3
    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file)
    })
    console.log("All files uploaded successfully")

    await new Promise((resolve) => setTimeout(resolve, 5000))

    //push to redis queue
    //insert status in hashset of redis
    //delete content of dist/output folder
    deleteAllFiles(path.join(__dirname,"output",id))

    res.json({
        id
    })
})

app.listen(8080)