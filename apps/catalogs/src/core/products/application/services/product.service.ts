import { Injectable } from '@nestjs/common';

import { CreateProductInput, FindProductInput, UpdateProductInput } from '../dto';
import { CommandProduct, Product, QueryProduct } from '../../domain';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand, DeleteProductCommand, UpdateProductCommand } from '../commands/impl';

@Injectable()
export class ProductService {
  constructor(private readonly commandBus: CommandBus) {}

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    return null;
  }

  async findOne(id: number): Promise<Product> {
    return null;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const product = await this.commandBus.execute<CreateProductCommand, Product>(
      new CreateProductCommand(createProductInput),
    );
    return product;
  }

  async update(productId: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.commandBus.execute<UpdateProductCommand, Product>(
      new UpdateProductCommand(productId, updateProductInput),
    );
    return product;
  }

  async delete(productId: number): Promise<boolean> {
    const idDelete = await this.commandBus.execute<DeleteProductCommand, boolean>(
      new DeleteProductCommand(productId),
    );
    return idDelete;
  }
}
