import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { Device } from 'src/core/enums/device.type';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Fcm {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Field(() => String)
  @Column()
  token: string;
  @Field(() => Device)
  @Column('enum', { enum: Device })
  device: Device;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
  createdAt: number;
}
