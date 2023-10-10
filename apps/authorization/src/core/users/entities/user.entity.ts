import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users', synchronize: true })
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'text' })
  username: string;

  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @Exclude()
  @Column({ type: 'text' })
  passwordSalt: string;

  @Field()
  @Column({ type: 'text' })
  role: string;
}
