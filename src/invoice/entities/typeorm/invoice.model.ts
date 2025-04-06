import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Invoice } from '../invoice.entity';
import { CustomerModel } from '../../../customer/entities/typeorm/customer';

@Entity('invoices')
@Unique(['customer', 'referenceMonth', 'referenceYear'])
export class InvoiceModel implements Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  referenceMonth: string;

  @Column({ type: 'varchar', length: 4, nullable: false })
  referenceYear: string;

  @Column({ type: 'numeric', nullable: false })
  electricityConsumptionKWh: number;

  @Column({ type: 'numeric', nullable: false })
  electricityCost: number;

  @Column({ type: 'numeric', nullable: false })
  sceeeEnergyWithICMSKWh: number;

  @Column({ type: 'numeric', nullable: false })
  sceeeEnergyWithICMSCost: number;

  @Column({ type: 'numeric', nullable: false })
  compensatedEnergyKWh: number;

  @Column({ type: 'numeric', nullable: false })
  compensatedEnergyCost: number;

  @Column({ type: 'numeric', nullable: false })
  publicLightingContributionKWh: number;

  @ManyToOne(() => CustomerModel, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerModel;
}
