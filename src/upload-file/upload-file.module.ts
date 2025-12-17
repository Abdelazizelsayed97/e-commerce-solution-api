import { Module } from "@nestjs/common";
import { UploadFileResolver } from "./upload-file.resolver";
import { UploadFileService } from "./upload-file.service";

@Module({
  providers: [UploadFileResolver, UploadFileService],
  exports: [
    UploadFileService
  ]
})
export class UploadFileModule {}
