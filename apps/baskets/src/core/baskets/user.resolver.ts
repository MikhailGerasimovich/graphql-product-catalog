import { Resolver } from '@nestjs/graphql';
import { BasketService } from './basket.service';

@Resolver()
export class UserResolver {
  constructor(private readonly basketService: BasketService) {}
}
