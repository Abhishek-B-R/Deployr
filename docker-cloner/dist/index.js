"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// const app=express()
// app.use(cors())
// app.use(express.json())
// app.get("/",(req,res)=>{
//     res.json({
//         msg:"Docker Builder API is running"
//     })
// })
// app.post("/deploy",async (req,res)=>{
//     const {
//       id,
//       repository,
//       branch,
//       session
//     } = req.body;
//     const repo_url = `https://${repository.split("/")[0]}:${session.accessToken}@github.com/${repository}.git`
//     console.log(repo_url)
//     //clone data from url and get all file paths and omit all folder names
//     await simpleGit().clone(repo_url, path.join(__dirname, `output/${id}`), ['--branch', branch, '--depth', '1'])
//     const files=getAllFiles(path.join(__dirname,`output/${id}`))
//     //put this in s3
//     files.forEach(async file=>{
//         await uploadFile(file.slice(__dirname.length+1),file)
//     })
//     console.log("All files uploaded successfully")
//     await new Promise((resolve) => setTimeout(resolve, 5000))
//     //push to redis queue
//     publisher.lPush("build-queue",id)
//insert status in hashset of redis
const id = "cmcd2k0zt0005oucgv0r7eh3n";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const pgClient = new pg_1.Client("postgresql://neondb_owner:npg_yhQwTNf01ZdE@ep-bold-poetry-a1ntc664-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
    yield pgClient.connect();
    yield Promise.race([
        pgClient.query(`UPDATE "Project" SET status = $1 WHERE id = $2`, ['BUILD_SUCCESS', id]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Query timed out')), 5000))
    ]);
    pgClient.end();
}))();
//     //delete content of dist/output folder
//     deleteAllFiles(path.join(__dirname,"output",id))
//     res.json({
//         id
//     })
// })
// app.listen(8080)
