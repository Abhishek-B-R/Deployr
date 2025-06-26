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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
exports.downloadS3Folder = downloadS3Folder;
exports.uploadFile = uploadFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envVars_1 = require("./envVars");
exports.s3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: envVars_1.R2_ENDPOINT,
    credentials: {
        accessKeyId: envVars_1.R2_ACCESS_KEY_ID,
        secretAccessKey: envVars_1.R2_SECRET_ACCESS_KEY
    }
});
// DOWNLOAD S3 FOLDER
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Downloading from:", prefix);
        const listRes = yield exports.s3.send(new client_s3_1.ListObjectsV2Command({
            Bucket: "deployr-bucket",
            Prefix: prefix,
        }));
        const files = listRes.Contents || [];
        const allPromises = files.map((_a) => __awaiter(this, [_a], void 0, function* ({ Key }) {
            if (!Key)
                return;
            const cleanedKey = Key.replace(/^output\//, "");
            const finalOutputPath = path_1.default.join(process.cwd(), "output", cleanedKey);
            const dirName = path_1.default.dirname(finalOutputPath);
            if (!fs_1.default.existsSync(dirName)) {
                fs_1.default.mkdirSync(dirName, { recursive: true });
            }
            const { Body } = yield exports.s3.send(new client_s3_1.GetObjectCommand({
                Bucket: "deployr-bucket",
                Key,
            }));
            return new Promise((resolve, reject) => {
                const stream = Body;
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                stream
                    .pipe(outputFile)
                    .on("finish", () => resolve())
                    .on("error", reject);
            });
        }));
        yield Promise.all(allPromises);
    });
}
// UPLOAD SINGLE FILE
function uploadFile(fileName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync(localFilePath);
        const response = yield exports.s3.send(new client_s3_1.PutObjectCommand({
            Body: fileContent,
            Bucket: "deployr-bucket",
            Key: fileName
        }));
        console.log("Uploaded:", response);
    });
}
