import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

import { likeFilter } from '@app/common';

import { ConnectionName } from '../../../common';
import { Product, QueryProduct } from '../domain';
import { FindProductInput } from '../application';

@Injectable()
export class QueryProductRepository {
  private repository: Repository<QueryProduct>;
  constructor(@InjectEntityManager(ConnectionName.Query) private readonly entityManager: EntityManager) {
    this.repository = this.entityManager.getRepository(QueryProduct);
  }

  async findAll(findProductInput: FindProductInput): Promise<QueryProduct[]> {
    const findEntity = this.repository.create(findProductInput);
    const products = await this.repository.find({
      where: {
        ...likeFilter(findEntity),
      },
    });

    return products;
  }

  async findOne(id: number): Promise<QueryProduct> {
    const product = await this.repository.findOne({ where: { id } });
    return product;
  }

  async save(product: Product) {
    const entity = this.repository.create(product);
    await this.repository.save(entity);
  }

  async delete(productId: number) {
    await this.repository.delete(productId);
  }
}
