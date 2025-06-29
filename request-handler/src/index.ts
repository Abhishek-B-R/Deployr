import express from "express";
import mime from "mime-types";
import { Readable } from "stream";
import { Pool } from "pg";
import { DATABASE_URL } from "./envVars";
import { getS3Object } from "./aws";
import { notFoundHandler } from "./not-found";

const pgClient = new Pool({
  connectionString: DATABASE_URL
});


const app = express();
const PORT = 8081;

app.get(/.*/, async (req, res) => {
  try {
    const host = req.hostname;
    const slug = host.split(".")[0];
    const splits = host.split(".").length
    if(splits < 2 || splits > 3) {
      notFoundHandler("Invalid host format", res);
      return;
    }
    let filePath = req.path;

    // If path is / or no extension, serve index.html
    if (filePath === "/" || !filePath.includes(".")) {
      filePath = "/index.html";
    }

    const { rows } = await pgClient.query(
      `SELECT * FROM "Project" WHERE slug = $1`,
      [slug]
    );
    const project = rows[0];

    if (!project?.id || project.private || project.status !== "BUILD_SUCCESS") {
      notFoundHandler("Project not found or unavailable", res);
      return;
    }

    const id = project.id;
    const s3Key = `dist/${id}${filePath}`;
    const s3Obj = await getS3Object(s3Key);
    if (!s3Obj || !s3Obj.Body) {
      notFoundHandler("File not found in S3", res);
      return;
    }

    const contentType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Powered-By", "deployr.live");
    res.setHeader("Server", "deployr.live");

    // Stream S3 object body
    (s3Obj.Body as Readable).pipe(res);

  } catch (err: any) {
    if (err.Code === "NoSuchKey" || err.name === "NoSuchKey") {
      console.warn("File not found:", err);
      res.status(404).send("File not found");
    } else {
      console.error("Internal error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
