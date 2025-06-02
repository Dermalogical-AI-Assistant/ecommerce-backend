import { Injectable, NotFoundException } from '@nestjs/common';
import * as fsPromise from 'fs/promises';
import { PrismaService } from 'src/database';

@Injectable()
export class ImportFileService {
    constructor(private readonly dbContext: PrismaService) { }

    public async validateImportFileExists(id: string) {
        const importFile = await this.dbContext.importFile.findUnique({ where: { id } });
        if (!importFile?.id) {
            throw new NotFoundException("Import file not found!")
        }

        return importFile;
    }

    public async deleteFile(filePath: string) {
        try {
            await fsPromise.unlink(filePath);
            console.log(`File ${filePath} deleted successfully`);
        } catch (err: any) {
            console.error(`Error deleting file ${filePath}:`, err.message);
        }
    }
}
