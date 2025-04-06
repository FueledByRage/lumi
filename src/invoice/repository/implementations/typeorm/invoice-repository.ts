import { Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceModel } from 'src/invoice/entities/typeorm/invoice.model';
import { Repository } from 'typeorm';
import { InvoiceRepository } from '../../invoice.repository';
import { DashboardInvoiceSummary } from 'src/invoice/dto/invoices-summary.dto';
import { DashboardSummaryRequest } from '../../invoice-repository.types';

@Injectable()
export class InvoiceRepositoryImpl implements InvoiceRepository {
  private readonly logger = new Logger();
  constructor(
    @Inject('InvoiceRepositoryTypeOrm')
    private readonly invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async save(invoice: Omit<InvoiceModel, 'id'>) {
    try {
      const invoiceModel = this.invoiceRepository.create(invoice);
      return await this.invoiceRepository.save(invoiceModel);
    } catch (error) {
      this.logger.error('Error saving invoice', error);
      throw new Error('Error saving invoice');
    }
  }

  async findById(id: number) {
    return await this.invoiceRepository.findOne({
      where: { id },
    });
  }

  async getDashboardSummary({
    customerId,
    year,
    month,
  }: DashboardSummaryRequest): Promise<DashboardInvoiceSummary> {
    const params = [customerId.toString()];
    let query = `
      SELECT
        COALESCE(SUM("electricityConsumptionKWh" + "sceeeEnergyWithICMSKWh" + "compensatedEnergyKWh" + "publicLightingContributionKWh"), 0) AS "totalEnergy",
        COALESCE(SUM("electricityCost" + "sceeeEnergyWithICMSCost" + "compensatedEnergyCost"), 0) AS "totalValue",
        COALESCE(SUM("compensatedEnergyCost"), 0) AS "compensatedValue",
        COUNT(*) AS "invoiceCount"
      FROM "invoices"
      WHERE "customerId" = $1
    `;

    if (year) {
      params.push(year);
      query += ` AND "referenceYear" = $${params.length}`;
    }

    if (month) {
      params.push(month);
      query += ` AND "referenceMonth" = $${params.length}`;
    }

    try {
      const [result] = await this.invoiceRepository.query(query, params);

      const totalEnergy = Number(result.totalEnergy);
      const totalValue = Number(result.totalValue);
      const compensatedValue = Number(result.compensatedValue);
      const invoiceCount = Number(result.invoiceCount);
      const averageCostPerKWh = totalEnergy > 0 ? totalValue / totalEnergy : 0;

      return {
        totalEnergy,
        totalValue,
        averageCostPerKWh,
        invoiceCount,
        compensatedValue,
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard summary', error);

      return {
        totalEnergy: 0,
        totalValue: 0,
        averageCostPerKWh: 0,
        invoiceCount: 0,
        compensatedValue: 0,
      };
    }
  }

  async getMonthlyData(customerId: number, year: number) {
    const params = [customerId, year];

    const consumptionQuery = `
      SELECT "referenceMonth" AS month, SUM("electricityConsumptionKWh") AS value
      FROM "invoices"
      WHERE "customerId" = $1 AND "referenceYear" = $2
      GROUP BY "referenceMonth"
      ORDER BY "referenceMonth"
    `;

    const compensationQuery = `
      SELECT "referenceMonth" AS month, SUM("compensatedEnergyCost") AS value
      FROM "invoices"
      WHERE "customerId" = $1 AND "referenceYear" = $2
      GROUP BY "referenceMonth"
      ORDER BY "referenceMonth"
    `;

    try {
      const [consumptionData, compensationData] = await Promise.all([
        this.invoiceRepository.query(consumptionQuery, params),
        this.invoiceRepository.query(compensationQuery, params),
      ]);

      const format = (arr: any[]) =>
        arr.map((item) => ({
          month: item.month,
          value: Number(item.value) * -1,
        }));

      return {
        consumption: format(consumptionData),
        compensation: format(compensationData),
      };
    } catch (error) {
      this.logger.error('Error fetching monthly data', error);
      throw new Error('Error fetching monthly data');
    }
  }
}
