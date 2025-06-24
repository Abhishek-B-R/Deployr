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
exports.uploadFile = uploadFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const R2_ENDPOINT = "https://d742946faacb17bc54e8996509568e49.r2.cloudflarestorage.com";
const R2_ACCESS_KEY_ID = "0e608e1af543c2a9167a1a6c18c9d430";
const R2_SECRET_ACCESS_KEY = "2e27b678bb3d5de670057efe37e84896d0351f86b7fc11751d4f76582af07d8f";
exports.s3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT, // change to your region
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});
function uploadFile(fileName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync(localFilePath);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: "deployr-bucket",
            Key: fileName,
            Body: fileContent
        });
        const response = yield exports.s3.send(command);
        console.log("Uploaded:", response);
    });
}
