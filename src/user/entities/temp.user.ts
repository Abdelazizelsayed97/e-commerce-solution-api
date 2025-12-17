import { User } from './user.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TempUser extends User {}
