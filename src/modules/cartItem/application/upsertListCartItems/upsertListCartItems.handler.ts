import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateListOrderItemsCommand } from './upsertListCartItems.command';
import { PrismaService } from 'src/database';
import * as _ from 'lodash';

@CommandHandler(CreateListOrderItemsCommand)
export class CreateListOrderItemsHandler
  implements ICommandHandler<CreateListOrderItemsCommand> {
  constructor(
    private readonly dbContext: PrismaService,
  ) {}

  public async execute({
    userId,
    body: { cartItems },
  }: CreateListOrderItemsCommand) {
    const productIds = _.uniq(cartItems.map(x => x.productId));

    const existingCartItems = await this.dbContext.cartItem.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
      select: {
        id: true,
        productId: true,
      },
    });

    const existingProductIds = existingCartItems.map(item => item.productId);
    const newProductIds = _.difference(productIds, existingProductIds);

    const newCartItems = cartItems.filter(x =>
      newProductIds.includes(x.productId),
    );

    const updateTasks = existingCartItems.map(existingItem => {
      const updatedData = cartItems.find(
        x => x.productId === existingItem.productId,
      );
      if (!updatedData) return null;

      return this.dbContext.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: updatedData.quantity },
      });
    }).filter(Boolean);

    const createTask = this.dbContext.cartItem.createMany({
      data: newCartItems.map(x => ({
        quantity: x.quantity,
        productId: x.productId,
        userId,
      })),
    });

    await Promise.all([...updateTasks, createTask]);
  }
}
