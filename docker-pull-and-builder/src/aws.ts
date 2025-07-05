import { 
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command 
} from "@aws-sdk/client-s3";
import fs from "fs"
import path from "path";
import { Readable } from "stream";
import s3 from "./s3Client";


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
