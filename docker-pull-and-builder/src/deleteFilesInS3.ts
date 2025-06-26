import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { R2_ENDPOINT,R2_ACCESS_KEY_ID,R2_SECRET_ACCESS_KEY } from "./envVars";

export const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT!,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

export async function deleteAllFilesFromR2(folderPrefix: string): Promise<void> {
  const prefix = folderPrefix.endsWith("/") ? folderPrefix : `${folderPrefix}/`;
  let isTruncated = true;
  let continuationToken: string | undefined;
  let totalDeleted = 0;

  while (isTruncated) {
    const listCommand = new ListObjectsV2Command({
      Bucket: "deployr-bucket",
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const listedObjects = await s3.send(listCommand);

    const objectsToDelete =
      listedObjects.Contents?.map((obj) => ({ Key: obj.Key! })) || [];

    if (objectsToDelete.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: "deployr-bucket",
        Delete: {
          Objects: objectsToDelete,
          Quiet: true,
        },
      });

      const deleteResponse = await s3.send(deleteCommand);
      totalDeleted += deleteResponse.Deleted?.length || 0;
    }

    isTruncated = listedObjects.IsTruncated ?? false;
    continuationToken = listedObjects.NextContinuationToken;
  }

  console.log(`✅ Deleted ${totalDeleted} objects from prefix: ${prefix}`);
}
