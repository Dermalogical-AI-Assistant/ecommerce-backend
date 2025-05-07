import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { UpdateProductByIdCommand } from './updateProductById.command';
import { ProductService } from '../../services';

@CommandHandler(UpdateProductByIdCommand)
export class UpdateProductByIdHandler
  implements ICommandHandler<UpdateProductByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute({ id, body }: UpdateProductByIdCommand): Promise<void> {
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

    await this.productService.validateProductExistsById(id);

    await this.dbContext.product.update({
      where: { id },
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
