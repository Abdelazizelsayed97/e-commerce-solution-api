import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Follower {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.followers)
  @JoinColumn({
    name: 'vendor_id',
    referencedColumnName: 'id',
  })
  vendor: Vendor;

  @Column()
  vendor_id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'follower_id',
    referencedColumnName: 'id',
  })
  follower: User;

  @Column()
  follower_id: string;

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
