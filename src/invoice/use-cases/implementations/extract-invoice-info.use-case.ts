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
    const registrationNumber = this.extractInstallationNumber(text);

    const customerNameRegex = /\n([^\n]+)\n[^\n]+\n[^\n]+\n[^\n]+\nCNPJ/;
    const customerName = this.extractString(text, customerNameRegex);

    const date = this.extractString(
      text,
      /((JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4})/i,
    );

    const referenceDate = this.extractString(
      text,
      /((JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4})/i,
    );

    const referenceDateParts = referenceDate.split('/');

    const referenceMonth = referenceDateParts[0];
    const referenceYear = referenceDateParts[1];

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
      customerName,
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

  private extractString(text: string, ...regexes: RegExp[]): string {
    for (const regex of regexes) {
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  }

  private parseNumber(value: string): number {
    return parseFloat(value.replace(',', '.')) || 0;
  }

  private extractInstallationNumber(text: string): string {
    const regex = /\b\d{10}\b/g;
    const matches = text.match(regex);

    if (matches && matches.length >= 2) {
      return matches[1];
    }

    return '';
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
    customerName: string;
  }): ExtractedInvoiceData {
    return {
      registrationNumber: data.registrationNumber,
      customerName: data.customerName,
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
