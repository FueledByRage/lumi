import { Customer } from '../customer.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerModel implements Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  registrationNumber: string;

  @Column()
  distributor: string;
}
