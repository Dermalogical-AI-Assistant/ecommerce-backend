import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';

@Injectable()
export class ProductService {
  constructor(private readonly dbContext: PrismaService) {}

  public async validateProductExistsById(id: string) {
    const product = await this.dbContext.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Product not found!");
    }
    return product;
  }
}
