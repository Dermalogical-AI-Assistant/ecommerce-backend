import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { CreateProductCommand } from './createProduct.command';
import { ProductService } from '../../services';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute({ body }: CreateProductCommand): Promise<any> {
    const {
      thumbnail,
      additionalImages,
      title,
      price,
      currency,
      description,
      fullIngredientsList,
      howToUse,
      ingredientBenefits,
    } = body;

    const skincareConcerns = [...new Set(body?.skincareConcerns || [])];
    const product = await this.dbContext.product.create({
      data: {
        thumbnail,
        additionalImages,
        title,
        price,
        currency,
        description,
        fullIngredientsList,
        howToUse,
        ingredientBenefits,
        skincareConcerns,
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
      },
    });

    await this.productService.addProductToNeo4j(product);
    return product;
  }
}
