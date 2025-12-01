import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from 'src/role/entities/role.entity';
import {
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
  Entity,
} from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Follower } from 'src/followers/entities/follower.entity';

@ObjectType()
@Entity({ synchronize: true })
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column()
  email: string;
  @Column()
  password: string;
  @Field(() => String)
  @Column()
  token: string;
  @Field(() => Role)
  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;
  @Field(() => [Address])
  @OneToMany(() => Address, (address) => address.id)
  @JoinColumn()
  address: Address[];
  @Field(() => String)
  @Column()
  phoneNumber: string;
  @Field(() => Boolean)
  @Column()
  isVendor: boolean;
  @Field(()=>[Follower])
  @OneToMany(()=>Follower,(follower)=>follower.follower)
  followingVendor:Follower[]
}
