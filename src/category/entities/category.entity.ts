import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class Category extends BasicClass {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.category, { nullable: true })
  products: Product[];
}
