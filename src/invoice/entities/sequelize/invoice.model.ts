import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from '../invoice.entity';
import { CustomerModel } from 'src/customer/entities/sequelize/customer';

@Entity()
export class InvoiceModel implements Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceMonth: string;

  @Column()
  referenceYear: string;

  @Column()
  electricityConsumptionKWh: number;

  @Column()
  electricityCost: number;

  @Column()
  sceeeEnergyWithICMSKWh: number;

  @Column()
  sceeeEnergyWithICMSCost: number;

  @Column()
  compensatedEnergyKWh: number;

  @Column()
  compensatedEnergyCost: number;

  @Column()
  publicLightingContributionKWh: number;

  @Column()
  url: string;

  @ManyToOne(
    () => CustomerModel,
    (customer: CustomerModel) => customer.invoices,
  )
  customer: CustomerModel;
}
