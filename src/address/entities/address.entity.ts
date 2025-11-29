import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Address {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  state: string;
  @Field(() => String)
  @Column()
  city: string;
  @Field(() => String)
  @Column()
  address: string;
  //  @Field(() => String)
  //  @Column()
  //   user: string;
}
