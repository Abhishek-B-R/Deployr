import { Response } from "express";
import fs from "fs";
import path from "path";

export function notFoundHandler(message:string,res:Response ) {
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, "404.html"),
    "utf-8"
  );

  const filledHtml = htmlTemplate
    .replace("{{REQUEST_ID}}", "bom1::fs5hb-XYZ")
    .replace("{{MESSAGE}}", "The requested file does not exist.");

  res.status(404).send(filledHtml);
};
