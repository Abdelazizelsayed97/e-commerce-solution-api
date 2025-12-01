import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Follower {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.followers)
  vendor: Vendor;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  follower: User;
}
