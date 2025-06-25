"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2_SECRET_ACCESS_KEY = exports.R2_ACCESS_KEY_ID = exports.R2_ENDPOINT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.R2_ENDPOINT = process.env.R2_ENDPOINT;
exports.R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
exports.R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
