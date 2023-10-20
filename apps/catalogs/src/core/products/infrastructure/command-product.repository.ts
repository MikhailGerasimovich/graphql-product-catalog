import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ConnectionName } from '../../../common';
import { CommandProduct } from '../domain';
import { CreateProductInput, UpdateProductInput } from '../application';

@Injectable()
export class CommandProductRepository {
  private repository: Repository<CommandProduct>;
  constructor(@InjectEntityManager(ConnectionName.Command) private readonly entityManager: EntityManager) {
    this.repository = this.entityManager.getRepository(CommandProduct);
  }

  async findOne(id: number): Promise<CommandProduct> {
    const product = await this.repository.findOne({ where: { id } });
    return product;
  }
  async create(createProductInput: CreateProductInput): Promise<CommandProduct> {
    const productEntity = this.repository.create(createProductInput);
    const savedProduct = await this.repository.save(productEntity);
    return savedProduct;
  }
  async update(id: number, updateProductInput: UpdateProductInput): Promise<CommandProduct> {
    const existingProduct = await this.findOne(id);
    const productEntity = this.repository.create(updateProductInput);
    const updatedProduct = await this.repository.save({
      ...existingProduct,
      ...productEntity,
    });
    return updatedProduct;
  }
  async delete(id: number): Promise<boolean> {
    const data = await this.repository.delete(id);
    return data && data.affected > 0;
  }
}
