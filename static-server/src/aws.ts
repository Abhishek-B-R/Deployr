import { S3 } from "@aws-sdk/client-s3";
import {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
} from "./envVars";

const s3 = new S3({
  endpoint: R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

export async function getS3Object(key: string) {
    const s3Obj = await s3.getObject({
        Bucket: "deployr-bucket",
        Key: key
    });
    return s3Obj;
}