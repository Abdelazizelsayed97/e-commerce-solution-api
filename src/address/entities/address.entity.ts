import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Address {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  state: string;
  @Field(() => String)
  @Column()
  city: string;
  @Field(() => String)
  @Column({})
  details: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.address, {
    nullable: true,
    onDelete:'CASCADE'
    // cascade: true,
  })
  user: User;
}
