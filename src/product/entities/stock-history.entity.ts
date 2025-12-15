import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Order } from 'src/order/entities/order.entity';
import { stockHistoryActionEnum } from 'src/core/enums/stock.history.enum';

@ObjectType()
@Entity()
@Index('stock_history_product_idx', ['product_id'])
export class StockHistory {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, { nullable: true })
  order: Order;

  @Field(() => Int)
  @Column()
  quantityChanged: number;

  @Field(() => Int)
  @Column()
  previousStock: number;

  @Field(() => Int)
  @Column()
  newStock: number;

  @Field(() => String)
  @Column()
  action: stockHistoryActionEnum;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  reason: string;

  @Field()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
