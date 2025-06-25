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
const envVars_1 = require("./envVars");
exports.s3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: envVars_1.R2_ENDPOINT,
    credentials: {
        accessKeyId: envVars_1.R2_ACCESS_KEY_ID,
        secretAccessKey: envVars_1.R2_SECRET_ACCESS_KEY
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
