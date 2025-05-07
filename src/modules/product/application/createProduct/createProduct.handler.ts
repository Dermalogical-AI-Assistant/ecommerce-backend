import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { CreateProductCommand } from './createProduct.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({ body }: CreateProductCommand): Promise<void> {
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
      skincareConcerns,
    } = body;

    await this.dbContext.product.create({
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
    });
  }
}
