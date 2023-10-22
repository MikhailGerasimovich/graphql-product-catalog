import { Controller } from '@nestjs/common';
import { ProductService } from '../application';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Pattern, RequestTakeProductInfo, ResponseTakeProductInfo } from '@app/common';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(Pattern.TakeProduct)
  async takeProduct(@Payload() reqTakeProduct: RequestTakeProductInfo): Promise<ResponseTakeProductInfo> {
    const resTakeProduct = await this.productService.takeProduct(reqTakeProduct);
    return resTakeProduct;
  }
}
