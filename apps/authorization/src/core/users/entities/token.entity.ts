import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @ManyToOne(() => User, (user: User) => user.tokens)
  user: User;
}
