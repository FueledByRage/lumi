import { InvoiceModel } from 'src/invoice/entities/sequelize/invoice.model';
import { Customer } from '../customer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomerModel implements Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  registrationNumber: string;

  @Column()
  distributor: string;

  @OneToMany(() => InvoiceModel, (invoice) => invoice.customer)
  invoices: InvoiceModel[];
}
