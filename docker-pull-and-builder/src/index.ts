import { downloadS3Folder } from "./aws";
import { buildProject, copyFinalDist } from "./docker-builder";
import { deleteAllFilesFromR2 } from "./deleteFilesInS3";
import path from "path";
import { deleteAllFiles } from "./deleteLocalFiles";
import { subscriber } from "./redis";
import pgClient from "./db";

async function getNextJobId(): Promise<string | null> {
  try {
    const response = await subscriber.brPop("build-queue", 10); // 10s timeout
    if (response !== null) {
      return response.element;
    }
  } catch (e) {
    console.error("Redis error:", e);
  }

  // Fallback to FailedJobs table
  try {
    const failedJob = await pgClient.query(`SELECT id FROM "FailedJobs" LIMIT 1`);
    if (failedJob.rows.length > 0) {
      const id = failedJob.rows[0].id;
      await pgClient.query(`DELETE FROM "FailedJobs" WHERE id = $1`, [id]); // Remove it from FailedJobs
      return id;
    }
  } catch (e) {
    console.error("PostgreSQL error while fetching FailedJobs:", e);
  }

  return null;
}

async function main() {
  while (true) {
    console.log("Waiting for job...");
    const id = await getNextJobId();
    if (!id) continue;

    try {
      console.log("Processing job ID:", id);
      await downloadS3Folder(`output/${id}`);
      console.log("Downloaded from S3");

      const result = await pgClient.query(
        `SELECT "rootDirectory", "installCommand", "outputDirectory", "buildCommand" FROM "Project" WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) throw new Error(`Project with id ${id} not found`);

      const { rootDirectory, installCommand, outputDirectory, buildCommand } = result.rows[0];

      const envResult = await pgClient.query(
        `SELECT key, value FROM "EnvVar" WHERE "projectId" = $1`,
        [id]
      );
      const envVarsArray = envResult.rows;
      await buildProject(
        id,
        rootDirectory,
        installCommand,
        buildCommand,
        envVarsArray.length ? envVarsArray : undefined
      );

      const size = await copyFinalDist(id, rootDirectory, outputDirectory);

      await pgClient.query(
        `UPDATE "Project" SET status = $1, size = $2 WHERE id = $3`,
        ['BUILD_SUCCESS', size, id]
      );

    } catch (error) {
      console.error("Error during build process:", error);
      try {
        await pgClient.query(
          `UPDATE "Project" SET status = $1 WHERE id = $2`,
          ['BUILD_FAILED', id]
        );
      } catch (dbError) {
        console.error("Failed to update project status in DB:", dbError);
      }
    } finally {
      await deleteAllFilesFromR2(path.join("output", id));
      deleteAllFiles(path.resolve("output", id));
    }
  }
}

main();
