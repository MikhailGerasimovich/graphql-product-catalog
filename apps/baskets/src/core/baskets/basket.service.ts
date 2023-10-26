import {
  BadRequestException,
  NotFoundException,
  Inject,
  Injectable,
  Scope,
  ExecutionContext,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { EntityManager, Repository } from 'typeorm';
import { CONTEXT } from '@nestjs/graphql';

import {
  Pattern,
  Payload,
  RequestTakeProductInfo,
  ResponseTakeProductInfo,
  RequestPurchaseInfo,
  ResponsePurchaseInfo,
  getTransactionFromContext,
  sendMessage,
} from '@app/common';

import { Basket } from './entities';
import { CreateBasketInput, PutProductInput, TakeProductInput } from './dto';
import { RmqClientName } from '../../common';
import { BasketProductService } from '../basket-products/basket-product.service';
import { BasketProduct } from '../basket-products/entities';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  private repository: Repository<Basket>;

  constructor(
    @InjectRepository(Basket) private readonly basketRepository: Repository<Basket>,
    @Inject(RmqClientName.Catalog) private readonly client: ClientProxy,
    @Inject(CONTEXT) private readonly context: ExecutionContext,
    private readonly basketProductService: BasketProductService,
  ) {
    if (!context) {
      this.repository = basketRepository;
      return;
    }
    const entityManager = getTransactionFromContext(context);
    this.repository = this.getBasketRepo(entityManager);
  }

  async findOneByUserId(userId: number): Promise<Basket> {
    const basket = await this.repository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });
    return basket;
  }

  async takeProduct(takeProductInput: TakeProductInput, payload: Payload): Promise<Basket> {
    const reqTakeProductInfo = this.createRequestTakeProductInfo(takeProductInput);
    const resTakeProductInfo = await this.sendMessageToCotalog<ResponseTakeProductInfo>(
      Pattern.TakeProduct,
      reqTakeProductInfo,
    );

    const { isAvailable, priductQuantity, productPrice, productId, productTitle } = resTakeProductInfo;

    if (!isAvailable) {
      throw new BadRequestException(`You can't take this product, or this quantity of the product`);
    }

    const basket = await this.findByUserIdOrCreate(payload.sub);
    if (!basket.basketProducts) {
      basket.basketProducts = [];
    }
    let basketProduct = basket.basketProducts.find((bp) => bp.productId == productId);

    if (!basketProduct) {
      basketProduct = await this.basketProductService.create(basket, productId, productTitle);
      basket.basketProducts.push(basketProduct);
    }

    basketProduct.productQuantity += priductQuantity;
    basketProduct.productsPrice = basketProduct.productQuantity * productPrice;

    basket.totalPrice = basket.basketProducts.reduce((prev, bp) => (prev += bp.productsPrice), 0);

    await this.basketProductService.save(basketProduct);
    return await this.repository.save(basket);
  }

  async putProduct(putProductInput: PutProductInput, payload: Payload): Promise<Basket> {
    const basket = await this.findOneByUserId(payload.sub);
    if (!basket) {
      throw new BadRequestException('The basket is missing');
    }

    if (!basket.basketProducts) {
      basket.basketProducts = [];
    }

    const { productId, productQuantity } = putProductInput;

    const basketProduct = basket.basketProducts.find((bp) => bp.productId == productId);
    if (!basketProduct) {
      throw new NotFoundException(`The product with this id was not found`);
    }

    if (basketProduct.productQuantity <= productQuantity) {
      basket.totalPrice -= basketProduct.productsPrice;
      basket.basketProducts = basket.basketProducts.filter((bp) => bp.productId != productId);
      await this.basketProductService.delete(basketProduct.id);
      return await this.repository.save(basket);
    }

    const putPrice = (basketProduct.productsPrice / basketProduct.productQuantity) * productQuantity;
    basket.totalPrice -= putPrice;
    basketProduct.productsPrice -= putPrice;
    basketProduct.productQuantity -= productQuantity;
    await this.basketProductService.save(basketProduct);
    return await this.repository.save(basket);
  }

  async toPurchase(reqPurchseInfo: RequestPurchaseInfo): Promise<ResponsePurchaseInfo> {
    const { basketProductId, userId } = reqPurchseInfo;
    const basket = await this.findOneByUserId(userId);

    const basketProducts = basket.basketProducts.filter((bp) => basketProductId.includes(bp.id));

    const resPurchaseInfo = this.createResponsePurchaseInfo(basketProducts);

    //удалить купленные basketProduct
    return resPurchaseInfo;
  }

  private createResponsePurchaseInfo(basketProducts: BasketProduct[]): ResponsePurchaseInfo {
    const resPurchaseInfo = new ResponsePurchaseInfo();
    resPurchaseInfo.currency = 'USD';
    resPurchaseInfo.totalPrice = basketProducts.reduce((acc, bp) => acc + bp.productsPrice, 0);
    basketProducts.forEach((bp) => {
      resPurchaseInfo.products.push({
        productId: bp.productId,
        productQuantity: bp.productQuantity,
        productsPrice: bp.productsPrice,
        productTitle: bp.productTitle,
      });
    });
    return resPurchaseInfo;
  }

  private createRequestTakeProductInfo(takeProductInput: TakeProductInput): RequestTakeProductInfo {
    const reqTakeProductInfo = new RequestTakeProductInfo();
    reqTakeProductInfo.productId = takeProductInput.productId;
    reqTakeProductInfo.productQuantity = takeProductInput.productQuantity || 1;
    return reqTakeProductInfo;
  }

  private async findByUserIdOrCreate(userId: number): Promise<Basket> {
    const existingBasket = await this.repository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });

    if (existingBasket) {
      return existingBasket;
    }

    const createBasketInput = new CreateBasketInput();
    createBasketInput.userId = userId;
    createBasketInput.totalPrice = 0;

    const basketEntity = this.repository.create(createBasketInput);
    const basket = await this.repository.save(basketEntity);
    return basket;
  }

  private async sendMessageToCotalog<T>(pattern: string, data: any): Promise<T> {
    const response = await sendMessage<T>({ client: this.client, pattern, data });
    return response;
  }

  private getBasketRepo(entityManager: EntityManager): Repository<Basket> {
    if (entityManager) {
      return entityManager.getRepository(Basket);
    }
    return this.basketRepository;
  }
}
