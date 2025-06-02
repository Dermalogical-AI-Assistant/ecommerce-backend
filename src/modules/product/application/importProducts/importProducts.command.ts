import { ImportProductsRequestBody } from "./importProducts.request-body";

export class ImportProductsCommand {
  constructor(
    public readonly body: ImportProductsRequestBody,
    public readonly file: Express.Multer.File
  ) { }
}
