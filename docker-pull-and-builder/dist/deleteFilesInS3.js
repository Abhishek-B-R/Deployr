"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
exports.deleteAllFilesFromR2 = deleteAllFilesFromR2;
const client_s3_1 = require("@aws-sdk/client-s3");
const envVars_1 = require("./envVars");
exports.s3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: envVars_1.R2_ENDPOINT,
    credentials: {
        accessKeyId: envVars_1.R2_ACCESS_KEY_ID,
        secretAccessKey: envVars_1.R2_SECRET_ACCESS_KEY,
    },
});
function deleteAllFilesFromR2(folderPrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const prefix = folderPrefix.endsWith("/") ? folderPrefix : `${folderPrefix}/`;
        let isTruncated = true;
        let continuationToken;
        let totalDeleted = 0;
        while (isTruncated) {
            const listCommand = new client_s3_1.ListObjectsV2Command({
                Bucket: "deployr-bucket",
                Prefix: prefix,
                ContinuationToken: continuationToken,
            });
            const listedObjects = yield exports.s3.send(listCommand);
            const objectsToDelete = ((_a = listedObjects.Contents) === null || _a === void 0 ? void 0 : _a.map((obj) => ({ Key: obj.Key }))) || [];
            if (objectsToDelete.length > 0) {
                const deleteCommand = new client_s3_1.DeleteObjectsCommand({
                    Bucket: "deployr-bucket",
                    Delete: {
                        Objects: objectsToDelete,
                        Quiet: true,
                    },
                });
                const deleteResponse = yield exports.s3.send(deleteCommand);
                totalDeleted += ((_b = deleteResponse.Deleted) === null || _b === void 0 ? void 0 : _b.length) || 0;
            }
            isTruncated = (_c = listedObjects.IsTruncated) !== null && _c !== void 0 ? _c : false;
            continuationToken = listedObjects.NextContinuationToken;
        }
        console.log(`✅ Deleted ${totalDeleted} objects from prefix: ${prefix}`);
    });
}
