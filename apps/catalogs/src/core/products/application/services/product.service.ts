import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

import { CreateProductCommand, DeleteProductCommand, UpdateProductCommand } from '../commands';
import { FindAllProductsQuery, FindOneProductQuery } from '../queries';
import { CreateProductEvent, DeleteProductEvent, UpdateProductEvent } from '../events';
import { CreateProductInput, FindProductInput, UpdateProductInput } from '../dto';
import { Product } from '../../domain';

@Injectable()
export class ProductService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async findAll(findProductInput: FindProductInput): Promise<Product[]> {
    const products = await this.queryBus.execute<FindAllProductsQuery, Product[]>(
      new FindAllProductsQuery(findProductInput),
    );
    return products;
  }

  async findOne(productId: number): Promise<Product> {
    const product = await this.queryBus.execute<FindOneProductQuery, Product>(
      new FindOneProductQuery(productId),
    );
    return product;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const product = await this.commandBus.execute<CreateProductCommand, Product>(
      new CreateProductCommand(createProductInput),
    );

    this.eventBus.publish(new CreateProductEvent(product));
    return product;
  }

  async update(productId: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.commandBus.execute<UpdateProductCommand, Product>(
      new UpdateProductCommand(productId, updateProductInput),
    );

    this.eventBus.publish(new UpdateProductEvent(product));
    return product;
  }

  async delete(productId: number): Promise<boolean> {
    const idDelete = await this.commandBus.execute<DeleteProductCommand, boolean>(
      new DeleteProductCommand(productId),
    );

    this.eventBus.publish(new DeleteProductEvent(productId));
    return idDelete;
  }
}
