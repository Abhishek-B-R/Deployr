import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import path from "path"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws"
import { deleteAllFiles } from "./deleteFiles"
import { publisher } from "./redis"
import { Pool } from "pg"
import { DATABASE_URL } from "./envVars"
import { stat } from "fs"

const pgClient = new Pool({
    connectionString: DATABASE_URL
});

const app=express()
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.json({
        msg:"Docker Builder API is running"
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
    const files=await getAllFiles(path.join(__dirname,`output/${id}`))
    
    //put this in s3
    await Promise.all(files.map(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file)
    }));
    console.log("All files uploaded successfully")

    //push to redis queue
    publisher.lPush("build-queue",id)

    //insert status in DB
    await pgClient.query(`UPDATE "Project" SET status = $1 WHERE id = $2`, ['BUILDING', id]),
    
    //delete content of dist/output folder
    await deleteAllFiles(path.join(__dirname,"output",id))

    res.json({
        status: "success"
    })
})

app.listen(8080)