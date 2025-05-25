export class ImportProductsCommand {
  constructor(public readonly file: Express.Multer.File, public readonly userId: string) { }
}
