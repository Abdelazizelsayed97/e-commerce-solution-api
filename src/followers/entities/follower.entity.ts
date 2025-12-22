import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class Follower extends BasicClass {
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
  user: User;

  @Column()
  follower_id: string;
}
