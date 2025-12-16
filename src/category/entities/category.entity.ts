import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
  @Entity()
export class Category {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;
  
  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.category, { nullable: true })
  products: Product[];
}
