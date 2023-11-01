import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Token } from './token.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  username: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Exclude()
  @Column({ type: 'varchar' })
  passwordSalt: string;

  @Field()
  @Column({ type: 'varchar' })
  role: string;

  @OneToMany(() => Token, (token: Token) => token.user)
  tokens: Token[];
}
