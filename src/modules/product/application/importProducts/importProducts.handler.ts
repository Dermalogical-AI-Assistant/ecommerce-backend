import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { ImportProductsCommand } from './importProducts.command';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { ImportProductDto, PreprocessedImportProductDto } from '../../product.dto';
import { CurrencyType, SkincareConcern } from '@prisma/client';
import { getCapitalizedWord, isValidUrl } from 'src/common/utils/string';
import * as _ from 'lodash';
import { ImportLogService } from '../../services/importLog.service';
import { RabbitMqService } from 'src/modules/rabbitmq/services/rabbitmq.service';
import { PRODUCT_QUEUE } from 'src/common/queue/rabbitmq.queue';

@CommandHandler(ImportProductsCommand)
export class ImportProductsHandler
  implements ICommandHandler<ImportProductsCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly importLogService: ImportLogService,
    private readonly rabbitMqService: RabbitMqService,
  ) { }

  public async execute({ file, userId }: ImportProductsCommand): Promise<any> {
    const importFile = await this.dbContext.importFile.create({
      data: {
        userId,
        name: file.filename,
      }
    });

    const csvData = [];
    for await (const batch of this.parseCsvInBatches(file.path, 10)) {
      csvData.push(...batch)
      const { batchProductsToImport } = await this.validateBatchProduct(batch, importFile.id);
      await this.rabbitMqService.publish(PRODUCT_QUEUE, batchProductsToImport); // i dont wanna 'fire & forget'
    }

    return { message: 'File processed successfully', rows: csvData.length, importFile };
  }

  private async *parseCsvInBatches(filePath: string, batchSize = 10) {
    const stream = fs.createReadStream(filePath).pipe(csv());

    let batch: any[] = [];
    let index = 0;

    for await (const record of stream) {
      record['index'] = index++;
      batch.push(record);
      if (batch.length === batchSize) {
        yield batch;
        batch = [];
      }
    }

    // Yield the remaining records if any
    if (batch.length > 0) {
      yield batch;
    }
  }

  private async validateBatchProduct(batch: ImportProductDto[], importFileId: string) {
    const batchProductsToImport: PreprocessedImportProductDto[] = [];
    for (const product of batch) {
      const preprocessedProduct = await this.validateProduct(product, importFileId);
      if (preprocessedProduct) {
        batchProductsToImport.push(preprocessedProduct);
      }
    }
    return { batchProductsToImport };
  }

  private async validateProduct(
    product: ImportProductDto,
    importFileId: string
  ): Promise<PreprocessedImportProductDto | null> {
    let hasError = false;

    // Helper to log error and set hasError
    const logError = async (message: string) => {
      await this.importLogService.writeLog({
        importFileId,
        index: product.index,
        contentLog: message,
      });
      hasError = true;
    };

    // Validate required fields
    const requiredFields = ['thumbnail', 'title', 'price', 'skincareConcerns'];
    for (const field of requiredFields) {
      if (!product[field]) {
        await logError(`${getCapitalizedWord(field)} is missing!`);
      }
    }

    // Validate number fields
    const parsedPrice = Number(product.price);
    if (isNaN(parsedPrice)) {
      await logError(`Price cannot be converted to number!`);
    }

    const parsedAverageRating = product.averageRating ? Number(product.averageRating) : 0;
    if (isNaN(parsedAverageRating)) {
      await logError(`Average rating cannot be converted to number!`);
    }


    // Validate thumbnail URL
    if (product.thumbnail && !isValidUrl(product.thumbnail)) {
      await logError(`Thumbnail is not a valid URL!`);
    }

    // Parse and validate additionalImages
    const parsedAdditionalImages = product.additionalImages
      ? product.additionalImages.split(',').map((img) => img.trim())
      : undefined;

    if (parsedAdditionalImages) {
      for (const imgUrl of parsedAdditionalImages) {
        if (!isValidUrl(imgUrl)) {
          await logError(`Some additional images are not valid URLs!`);
          break; // Only log once
        }
      }
    }

    // Parse and validate skincare concerns
    const parsedSkincareConcerns = product.skincareConcerns.split(',').map((s) => s.trim());
    const validConcerns = Object.values(SkincareConcern);
    const invalidConcerns = _.difference(parsedSkincareConcerns, validConcerns);
    if (invalidConcerns.length > 0) {
      await logError(`Skincare concerns values must be ${validConcerns.join(', ')}`);
    }

    if (hasError) return null;

    await this.importLogService.writeLog({
      importFileId,
      contentLog: `Saved successfully!`,
      index: product.index
    });

    return {
      ...product,
      currency: CurrencyType.POUND,
    } as PreprocessedImportProductDto;
  }
}
