import { Injectable } from '@nestjs/common';
import {
  ExtractedInvoiceData,
  ExtractInvoiceDataUseCase,
} from '../extract-invoice-info.use-case';

@Injectable()
export class ExtractInvoiceDataUseCaseImpl
  implements ExtractInvoiceDataUseCase
{
  execute(text: string): ExtractedInvoiceData {
    console.log(text);

    const registrationNumber = this.extractString(
      text,
      /Nº DO CLIENTE\s+(\d+)/,
    );

    const date = this.extractString(
      text,
      /((JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4})/i,
    );

    const referenceMonth = this.extractString(
      text,
      /((JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4})/i,
    ).split('/')[0];
    const referenceYear = this.extractString(
      text,
      /((JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4})/i,
    ).split('/')[1];

    const distributor = this.extractDistributor(text);

    const electricity = this.extractEnergyInfo(
      text,
      /Energia Elétrica\s*kWh\s+(\d+)\s+[\d,.]+\s+([\d,.]+)/,
    );

    const sceee = this.extractEnergyInfo(
      text,
      /Energia SCEE s\/ ICMS\s*kWh\s+(\d[\d.]*)\s+[\d,.]+\s+([\d,.]+)/,
    );

    const compensated = this.extractEnergyInfo(
      text,
      /Energia compensada GD I\s*kWh\s+(\d[\d.]*)\s+[\d,.]+\s+(-[\d,.]+)/,
    );

    const publicLighting = this.extractNumber(
      text,
      /Contrib Ilum Publica Municipal\s+([\d,.]+)/,
    );

    return this.buildExtractedData({
      registrationNumber,
      date,
      referenceMonth,
      referenceYear,
      distributor,
      electricity,
      sceee,
      compensated,
      publicLighting,
    });
  }

  private extractDistributor(text: string): string {
    const match = text.match(
      /(CEMIG|CPFL|ENEL|EQUATORIAL|LIGHT|COELBA|CEEE|CEB|CELPA|COSERN|ENERGISA|EDP)/i,
    );
    return match ? match[1].toUpperCase() : '';
  }

  private extractEnergyInfo(
    text: string,
    pattern: RegExp,
  ): { quantity: number; value: number } {
    const match = text.match(pattern);
    return {
      quantity: match ? this.parseNumber(match[1]) : 0,
      value: match ? this.parseNumber(match[2]) : 0,
    };
  }

  private extractNumber(text: string, pattern: RegExp): number {
    const match = text.match(pattern);
    return match ? this.parseNumber(match[1]) : 0;
  }

  private extractString(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1] : '';
  }

  private parseNumber(value: string): number {
    return parseFloat(value.replace(',', '.')) || 0;
  }

  private buildExtractedData(data: {
    registrationNumber: string;
    date: string;
    referenceMonth: string;
    referenceYear: string;
    distributor: string;
    electricity: { quantity: number; value: number };
    sceee: { quantity: number; value: number };
    compensated: { quantity: number; value: number };
    publicLighting: number;
  }): ExtractedInvoiceData {
    return {
      registrationNumber: data.registrationNumber,
      date: data.date,
      referenceMonth: data.referenceMonth,
      referenceYear: data.referenceYear,
      distributor: data.distributor,
      electricityConsumptionKWh: data.electricity.quantity,
      electricityCost: data.electricity.value,
      sceeeEnergyWithICMSKWh: data.sceee.quantity,
      sceeeEnergyWithICMSCost: data.sceee.value,
      compensatedEnergyKWh: data.compensated.quantity,
      compensatedEnergyCost: data.compensated.value,
      publicLightingContributionKWh: data.publicLighting,
      totalConsumption: data.electricity.quantity + data.sceee.quantity,
      totalValueWithoutGD:
        data.electricity.value + data.sceee.value + data.publicLighting,
      gdSavings: data.compensated.value,
    };
  }
}
