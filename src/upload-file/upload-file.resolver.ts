import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { GraphQLUpload, type FileUpload } from "graphql-upload-ts";
import { UploadFileService } from "./upload-file.service";

@Resolver()
export class UploadFileResolver {
  constructor(private readonly uploadFileService: UploadFileService) {}
  @Mutation(() => String)
  async uploadFiles(
    @Args({ name: "files", type: () => GraphQLUpload })
    files: FileUpload
  ): Promise<string> {
    return await this.uploadFileService.uploadImage(files);
  }
}
