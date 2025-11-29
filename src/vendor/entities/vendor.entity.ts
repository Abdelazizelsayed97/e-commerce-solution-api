import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Vendor {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @OneToOne(() => User, (user) => user.id)
  user: User;
  @Field(() => String)
  @Column()
  shopName: string;
  @Field(() => Int)
  @Column()
  balance: number;
  @Field(() => Int)
  @Column()
  rating: number;
  @Field(() => Boolean)
  @Column()
  isVerfied: boolean;
}
