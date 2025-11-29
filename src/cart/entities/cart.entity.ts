import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@ObjectType()
@Entity()
export class Cart {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  userId: User;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createAt: Timestamp;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Timestamp;
}
