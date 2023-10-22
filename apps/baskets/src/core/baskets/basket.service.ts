import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { Pattern, Payload, RequestTakeProductInfo, ResponseTakeProductInfo, sendMessage } from '@app/common';

import { Basket } from './entities';
import { CreateBasketInput, TakeProductInput } from './dto';
import { RmqClientName } from '../../common';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket) private readonly basketRepository: Repository<Basket>,
    @Inject(RmqClientName.Catalog) private readonly client: ClientProxy,
  ) {}

  async findOneByUserId(userId: number): Promise<Basket> {
    const basket = await this.basketRepository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });

    return basket;
  }

  async takeProduct(takeProductInput: TakeProductInput, payload: Payload): Promise<Basket> {
    const reqTakeProductInfo = this.makeRequestTakeProductInfo(takeProductInput);
    const resTakeProductInfo = await this.sendMessageToCotalog<ResponseTakeProductInfo>(
      Pattern.TakeProduct,
      reqTakeProductInfo,
    );

    const { isAvailable } = resTakeProductInfo;

    if (!isAvailable) {
      throw new BadRequestException(`You can't take this product, or this quantity of the product`);
    }

    const basket = await this.findBasketOrCreate(payload.sub);
    return null;
  }

  async putProduct(productId: number, payload: Payload): Promise<Basket> {
    return null;
  }

  private async sendMessageToCotalog<T>(pattern: string, data: any): Promise<T> {
    const response = await sendMessage<T>({ client: this.client, pattern, data });
    return response;
  }

  private makeRequestTakeProductInfo(takeProductInput: TakeProductInput): RequestTakeProductInfo {
    const reqTakeProductInfo = new RequestTakeProductInfo();
    reqTakeProductInfo.productId = takeProductInput.productId;
    reqTakeProductInfo.productQuantity = takeProductInput.productQuantity || 1;
    return reqTakeProductInfo;
  }

  private async findBasketOrCreate(userId: number): Promise<Basket> {
    const existingBasket = await this.basketRepository.findOne({
      where: { userId: userId },
      relations: ['basketProducts'],
    });

    if (existingBasket) {
      return existingBasket;
    }

    const createBasketInput = new CreateBasketInput();
    createBasketInput.userId = userId;
    createBasketInput.totalPrice = 0;

    const basketEntity = this.basketRepository.create(createBasketInput);
    const basket = await this.basketRepository.save(basketEntity);
    return basket;
  }
}
