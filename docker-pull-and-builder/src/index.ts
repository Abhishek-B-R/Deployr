import { downloadS3Folder } from "./aws";
import { buildProject,copyFinalDist } from "./docker-builder";
import { deleteAllFilesFromR2 } from "./deleteFilesInS3";
import path from "path"
import { deleteAllFiles } from "./deleteLocalFiles";
import { subscriber } from "./redis";
import pgClient from "./db";

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

            const result = await pgClient.query(
            `SELECT "rootDirectory", "installCommand", "outputDirectory", "buildCommand" FROM "Project" WHERE id = $1`,
            [id]
            );
            console.log("fetched data from db for table Project")
        
            // Always check if we got a row
            if (result.rows.length === 0) {
            throw new Error(`Project with id ${id} not found`);
            }
        
            const { rootDirectory, installCommand, outputDirectory, buildCommand } = result.rows[0];
            
            // Fetch env variables
            const envResult = await pgClient.query(
            `SELECT key, value 
            FROM "EnvVar"
            WHERE "projectId" = $1`,
            [id]
            );
            console.log("fetched data from db for table EnvVar")
            console.log(envResult.rows)
            if(envResult.rows.length !== 0) {
                const envVars: Record<string, string> = {};
                for (const row of envResult.rows) {
                    envVars[row.key] = row.value;
                }
                const envVarsArray = envResult.rows;
                await buildProject(id,rootDirectory,installCommand,buildCommand,envVarsArray);
            }else{
                await buildProject(id,rootDirectory,installCommand,buildCommand);
            }

            copyFinalDist(id,rootDirectory,outputDirectory)

            //insert status in hashset of redis
            console.log(path.join("output",id))

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
        finally{            
            // delete all files used for the process
            await deleteAllFilesFromR2(path.join("output",id))
            deleteAllFiles(path.resolve("output",id))
        }
    }
}
main()