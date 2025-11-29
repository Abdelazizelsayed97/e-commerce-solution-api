import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
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
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Field(() => String)
  @Column()
  title: string;
  @Field(() => String)
  @Column()
  message: string;
  @Field(() => Boolean)
  @Column({ default: false })
  isRead: boolean;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Timestamp;
}
