import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { ResponsePurchaseInfo } from '@app/common';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(this.config.get('STRIPE_PRIVATE_KEY'), {
      apiVersion: this.config.get('STRIPE_API_VERSION'),
    });
  }

  async createCheckoutSession(purchaseInfo: ResponsePurchaseInfo) {
    console.log('work');

    const session = await this.stripe.checkout.sessions.create({
      currency: purchaseInfo.currency,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: purchaseInfo.products.map((product) => {
        return {
          price_data: {
            currency: purchaseInfo.currency,
            product_data: {
              name: product.productTitle,
            },
            unit_amount: product.productsPrice * 100, //количество центов! => надо * 100 цену
          },
          quantity: product.productQuantity, //количество такого товара
        };
      }),
      success_url: 'http://localhost:4000/success',
      cancel_url: 'http://localhost:4000/fail',
    });

    return { url: session.url }; //адресс для оплаты
  }
}
