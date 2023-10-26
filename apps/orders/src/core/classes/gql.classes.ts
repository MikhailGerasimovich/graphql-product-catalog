
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePurchaseInput {
    userId: number;
}

export class Order {
    id: number;
    userId: number;
    totalSpendMoney: number;
    orderProducts?: Nullable<OrderProducts[]>;
}

export class OrderProducts {
    id: number;
    productId: number;
    productQuantity: number;
    purchaseDate: string;
    order?: Nullable<Order>;
}

export abstract class IQuery {
    abstract findOrder(): Order | Promise<Order>;
}

export abstract class IMutation {
    abstract purchase(input?: Nullable<CreatePurchaseInput>): Order | Promise<Order>;
}

type Nullable<T> = T | null;
