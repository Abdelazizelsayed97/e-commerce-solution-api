import { Injectable } from "@nestjs/common";

import { type FileUpload } from "graphql-upload-ts";
import { createWriteStream } from "fs";
import * as fs from "fs";

@Injectable()
export class UploadFileService {
  async uploadImage(file: FileUpload): Promise<string> {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const { createReadStream, filename } = await file;
    const filePath = `${uploadDir}/${filename}`;
    await new Promise<void>((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on("finish", () => {
          resolve();
        })
        .on("error", reject);
    });
    return filePath;
  }
}
