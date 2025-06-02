export class CreateImportFileCommand {
  constructor(public readonly file: Express.Multer.File, public readonly userId: string) { }
}
