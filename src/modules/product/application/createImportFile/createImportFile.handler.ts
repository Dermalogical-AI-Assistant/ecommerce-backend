import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { CreateImportFileCommand } from './createImportFile.command';
import { ImportFileService } from '../../services/importFile.service';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@CommandHandler(CreateImportFileCommand)
export class CreateImportFileHandler
  implements ICommandHandler<CreateImportFileCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly importFileService: ImportFileService
  ) { }

  public async execute({ file, userId }: CreateImportFileCommand): Promise<any> {
    const numberOfRows = await this.getCsvRecordCount(file.path);
    const importFile = await this.dbContext.importFile.create({
      data: {
        userId,
        name: file.filename,
        totalRecords: numberOfRows
      },
      select: {
        id: true,
        userId: true,
        name: true,
        totalRecords: true,
        createdAt: true
      }
    });

    await this.importFileService.deleteFile(`./uploads/${file.filename}`)

    return importFile;
  }

  private async getCsvRecordCount(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      let count = 0;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', () => count++)
        .on('end', () => resolve(count))
        .on('error', (error) => reject(error));
    });
  }

}
