import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CONTEXT } from '@nestjs/graphql';

import { BasketProduct } from './entities';
import { CreateBasketProductInput, UpdateBasketProductInput } from './dto';
import { Basket } from '../baskets/entities';

import { getTransactionFromContext } from '@app/common';

@Injectable({ scope: Scope.REQUEST })
export class BasketProductService {
  private repository: Repository<BasketProduct>;

  constructor(
    @InjectRepository(BasketProduct) private readonly basketProductRepository: Repository<BasketProduct>,
    @Inject(CONTEXT) private readonly context: ExecutionContext,
  ) {
    if (!context) {
      this.repository = basketProductRepository;
      return;
    }
    const entityManager = getTransactionFromContext(context);
    this.repository = this.getBasketProductRepo(entityManager);
  }

  async create(basket: Basket, productId: number, productTitle: string): Promise<BasketProduct> {
    const createBasketProductInput = new CreateBasketProductInput();
    createBasketProductInput.basket = basket;
    createBasketProductInput.productId = productId;
    createBasketProductInput.productTitle = productTitle;
    createBasketProductInput.productsPrice = 0;
    createBasketProductInput.productQuantity = 0;

    const basketProductEntity = this.repository.create(createBasketProductInput);
    const basketProduct = await this.repository.save(basketProductEntity);
    return basketProduct;
  }

  async save(basketProduct: UpdateBasketProductInput): Promise<BasketProduct> {
    return await this.repository.save(basketProduct);
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }

  async forProduct(productId: number): Promise<BasketProduct> {
    const basketProduct = await this.repository.findOne({
      where: { productId },
    });

    return basketProduct;
  }

  private getBasketProductRepo(entityManager: EntityManager): Repository<BasketProduct> {
    if (entityManager) {
      return entityManager.getRepository(BasketProduct);
    }
    return this.basketProductRepository;
  }
}
