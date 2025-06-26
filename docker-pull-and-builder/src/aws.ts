import { 
    PutObjectCommand,
    S3Client,
    GetObjectCommand,
    ListObjectsV2Command 
} from "@aws-sdk/client-s3";
import fs from "fs"
import path from "path";
import { 
    R2_ACCESS_KEY_ID,
    R2_ENDPOINT,
    R2_SECRET_ACCESS_KEY 
} from "./envVars";
import { Readable } from "stream";

export const s3 = new S3Client({
    region: "auto",
    endpoint:R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});


// DOWNLOAD S3 FOLDER
export async function downloadS3Folder(prefix: string) {
  console.log("Downloading from:", prefix);

  const listRes = await s3.send(
    new ListObjectsV2Command({
      Bucket: "deployr-bucket",
      Prefix: prefix,
    })
  );

  const files = listRes.Contents || [];

  const allPromises = files.map(async ({ Key }) => {
    if (!Key) return;

    const cleanedKey = Key.replace(/^output\//, "");
    const finalOutputPath = path.join(process.cwd(), "output", cleanedKey);
    const dirName = path.dirname(finalOutputPath);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    const { Body } = await s3.send(
      new GetObjectCommand({
        Bucket: "deployr-bucket",
        Key,
      })
    );

    return new Promise<void>((resolve, reject) => {
      const stream = Body as Readable;
      const outputFile = fs.createWriteStream(finalOutputPath);
      stream
        .pipe(outputFile)
        .on("finish", () => resolve())
        .on("error", reject);
    });
  });

  await Promise.all(allPromises);
}


// UPLOAD SINGLE FILE
export async function uploadFile(fileName: string, localFilePath: string) {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.send(new PutObjectCommand({
        Body: fileContent,
        Bucket: "deployr-bucket",
        Key: fileName
    }));

    console.log("Uploaded:", response);
}
