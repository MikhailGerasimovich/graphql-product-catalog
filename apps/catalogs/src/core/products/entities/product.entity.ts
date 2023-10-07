import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('products', { synchronize: true })
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  title: string;

  @Field(() => Float)
  @Column({ type: 'real' })
  price: number;

  @Field()
  @Column({ type: 'text' })
  currency: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  quantity: number;
}
