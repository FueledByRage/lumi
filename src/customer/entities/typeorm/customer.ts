import { InvoiceModel } from 'src/invoice/entities/typeorm/invoice.model';
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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @OneToMany(() => InvoiceModel, (invoice) => invoice.customer)
  invoices: InvoiceModel[];
}
