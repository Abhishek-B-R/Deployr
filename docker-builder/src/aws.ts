import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import fs from "fs"
import { 
    R2_ACCESS_KEY_ID,
    R2_ENDPOINT,
    R2_SECRET_ACCESS_KEY 
} from "./envVars";

export const s3 = new S3Client({
    region: "auto",
    endpoint:R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});


export async function uploadFile(fileName: string, localFilePath: string) {
    const fileContent = fs.readFileSync(localFilePath);

    const command = new PutObjectCommand({
        Bucket: "deployr-bucket",
        Key: fileName,
        Body: fileContent
    });

    const response = await s3.send(command);
    console.log("Uploaded:", response);
}