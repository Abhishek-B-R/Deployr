import express from "express";
import mime from "mime-types";
import { Readable } from "stream";
import { Pool } from "pg";
import { DATABASE_URL } from "./envVars";
import { getS3Object } from "./aws";
import { notFoundHandler } from "./not-found";
import { checkRateLimit, getRetryAfterSeconds } from "./rateLimiter";

const pgClient = new Pool({
  connectionString: DATABASE_URL
});

function getClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = typeof forwarded === "string" ? forwarded : forwarded[0];
    return first.split(",")[0].trim();
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

const app = express();
const PORT = 8081;

app.set("trust proxy", 1);

app.get(/.*/, async (req, res) => {
  const ip = getClientIp(req);
  if (checkRateLimit(ip)) {
    const retryAfter = getRetryAfterSeconds(ip);
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).send("Too Many Requests. Try again later.");
    return;
  }

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

    if (!project?.id || project.isDeleted || project.status !== "BUILD_SUCCESS") {
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

    // Increment views in background (fire-and-forget)
    /* Temporarily done in server itself, on scale add these in Redis
      and update in DB every 1 minute only once for a particular id */
    await pgClient.query(
      `UPDATE "Project" SET views = views + 1 WHERE id = $1`,
      [id]
    ).catch((err) => {
      console.error("Error incrementing views:", err);
    });
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
