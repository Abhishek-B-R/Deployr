import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL!;

export const R2_ENDPOINT = process.env.R2_ENDPOINT!;
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;