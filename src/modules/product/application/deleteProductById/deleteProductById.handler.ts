import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { DeleteProductByIdCommand } from './deleteProductById.command';
import { ProductService } from '../../services';

@CommandHandler(DeleteProductByIdCommand)
export class DeleteProductByIdHandler
  implements ICommandHandler<DeleteProductByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute({ id }: DeleteProductByIdCommand): Promise<void> {
    await this.productService.validateProductExistsById(id);
    await this.dbContext.product.delete({ where: { id } });
  }
}
