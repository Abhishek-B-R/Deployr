import { downloadS3Folder } from "./aws";
import { buildProject,copyFinalDist } from "./docker-builder";
import { deleteAllFilesFromR2 } from "./deleteFilesInS3";
import path from "path"
import { deleteAllFiles } from "./deleteLocalFiles";
import { subscriber } from "./redis";
import { Client } from "pg"
import { DATABASE_URL } from "./envVars"

const pgClient = new Client(DATABASE_URL);
pgClient.connect()

async function  main() {
    while(1){
        console.log("Hey this function started working")
        const response=await subscriber.brPop(
            'build-queue',
            0
        );

        console.log(response)
        if(response===null) return
        const id=response.element
        try{
            
            await downloadS3Folder(`output/${id}`)
            console.log("downloaded")
            await buildProject(id)
            copyFinalDist(id)

            //insert status in hashset of redis
            console.log(path.join("output",id))

            // delete all files used for the process
            await deleteAllFilesFromR2(path.join("output",id))
            deleteAllFiles(path.resolve("output",id))

            //insert status in DB
            await Promise.race([
                pgClient.query(`UPDATE "Project" SET status = $1 WHERE id = $2`, ['BUILD_SUCCESS', id]),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Query timed out')), 5000))
            ])
        }catch(error){
            console.error("Error during build process:", error);
            try {
                await pgClient.query(`UPDATE "Project" SET status = $1 WHERE id = $2`, ['BUILD_FAILED', id]);
            } catch (dbError) {
                console.error("Failed to update project status in DB:", dbError);
            }
        }
    }
}
main()