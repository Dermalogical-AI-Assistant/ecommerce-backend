import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CurrencyType, SkincareConcern } from '@prisma/client';
import * as amqp from 'amqplib';
import { PRODUCT_QUEUE } from 'src/common/queue/rabbitmq.queue';
import { PrismaService } from 'src/database';
import { PreprocessedImportProductDto } from 'src/modules/product/product.dto';
import { ProductService } from 'src/modules/product/services';

const uri = process.env.RABBITMQ_URL;

@Injectable()
export class RabbitMqConsumer implements OnModuleInit {
    private readonly logger = new Logger(RabbitMqConsumer.name);

    constructor(
        private readonly dbContext: PrismaService,
        private readonly productService: ProductService,
    ) { }

    async onModuleInit() {
        try {
            const connection = await amqp.connect(uri);
            const channel = await connection.createChannel();
            await channel.purgeQueue(PRODUCT_QUEUE);

            await channel.assertQueue(PRODUCT_QUEUE, { durable: true });

            this.logger.log(`Waiting for messages in ${PRODUCT_QUEUE}`);

            channel.consume(PRODUCT_QUEUE, async (msg) => {
                if (msg !== null) {
                    const rawString = msg.content.toString('utf8');
                    let content: PreprocessedImportProductDto[];

                    if (rawString.startsWith('{"type":"Buffer"')) {
                        const bufferData = JSON.parse(rawString);
                        content = JSON.parse(Buffer.from(bufferData.data).toString('utf8'));
                    } else {
                        content = JSON.parse(rawString);
                    }

                    this.logger.log(`Received ${content.length} products to import`);

                    await this.importBatchProducts(content);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
        }
    }

    private async importBatchProducts(batchProducts: PreprocessedImportProductDto[]) {
        for (const productToImport of batchProducts) {
            console.log({ productToImport });
            const additionalImages = productToImport.additionalImages ? [... new Set(productToImport.additionalImages.split(',').map(img => img.trim()))] : [];
            const skincareConcerns = [... new Set(productToImport.skincareConcerns.split(',').map(sc => sc.trim()))] as SkincareConcern[]

            const product = await this.dbContext.product.create({
                data: {
                    title: productToImport.title,
                    thumbnail: productToImport.thumbnail,
                    currency: productToImport.currency as CurrencyType,
                    additionalImages,
                    skincareConcerns,
                    averageRating: productToImport.averageRating? Number(productToImport.averageRating) : 0,
                    price: Number(productToImport.price),
                    description: productToImport.description,
                    howToUse: productToImport.howToUse,
                    fullIngredientsList: productToImport.fullIngredientsList,
                    ingredientBenefits: productToImport.ingredientBenefits,
                    totalQuantity: productToImport.totalQuantity? Number(productToImport.totalQuantity) : 0
                },
                select: {
                    id: true,
                    title: true,
                    skincareConcerns: true,
                    thumbnail: true,
                    additionalImages: true,
                    createdAt: true,
                    price: true,
                    currency: true,
                    ingredientBenefits: true,
                    fullIngredientsList: true,
                    description: true,
                    howToUse: true,
                    totalQuantity: true,
                },
            });

            await this.productService.addProductToNeo4j(product);
            this.logger.log(`Imported product: ${product.title}`);
        }
    }
}
