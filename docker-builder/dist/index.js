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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const file_1 = require("./file");
const aws_1 = require("./aws");
const deleteFiles_1 = require("./deleteFiles");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        msg: "hey this is working"
    });
});
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, repository, branch, session } = req.body;
    const repo_url = `https://${repository.split("/")[0]}:${session.accessToken}@github.com/${repository}.git`;
    console.log(repo_url);
    //clone data from url and get all file paths and omit all folder names
    yield (0, simple_git_1.default)().clone(repo_url, path_1.default.join(__dirname, `output/${id}`), ['--branch', branch, '--depth', '1']);
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    //put this in s3
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
    }));
    console.log("All files uploaded successfully");
    yield new Promise((resolve) => setTimeout(resolve, 5000));
    //push to redis queue
    //insert status in hashset of redis
    //delete content of dist/output folder
    (0, deleteFiles_1.deleteAllFiles)(path_1.default.join(__dirname, "output", id));
    res.json({
        id
    });
}));
app.listen(8080);
