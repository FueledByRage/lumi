import { InvoiceModel } from 'src/invoice/entities/sequelize/invoice.model';
import { Customer } from '../customer.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerModel implements Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  customerNumber: string;

  @Column()
  name: string;

  @Column()
  distributor: string;

  @Column()
  invoices: InvoiceModel[];
}
