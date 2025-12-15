import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  user_id: string;

  @Field(() => String)
  @Column()
  title: string;
  @Field(() => String)
  @Column()
  message: string;
  @Field(() => Boolean)
  @Column({ default: false })
  isRead: boolean;
  @Field()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;

  @Field({
    nullable: true,
  })
  @Column('timestamp', {
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: number;
}
