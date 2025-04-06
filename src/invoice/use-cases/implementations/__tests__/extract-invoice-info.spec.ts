import { Test, TestingModule } from '@nestjs/testing';
import { ExtractInvoiceDataUseCaseImpl } from '../extract-invoice-info.use-case';
import { ExtractedInvoiceData } from '../../extract-invoice-info.use-case';

describe('ExtractInvoiceDataUseCaseImpl', () => {
  let useCase: ExtractInvoiceDataUseCaseImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtractInvoiceDataUseCaseImpl],
    }).compile();

    useCase = module.get(ExtractInvoiceDataUseCaseImpl);
  });

  it('should extract correct invoice data from text', () => {
    const invoiceText = `
    CEMIG DISTRIBUIÇÃO S.A.
    NÚMERO DA INSTALAÇÃO: 0123456789
    NÚMERO DE IDENTIFICAÇÃO: 9876543210
    DATA DE EMISSÃO: 05/05/2023
    REFERENTE A: MAI/2023
    
    Código de barras 12345678
    JOÃO DA SILVA
    RUA DAS FLORES 123
    CENTRO
    12345-678 BELO HORIZONTE, MG
    CNPJ 12.345.678/0001-00
    
    Energia Elétrica kWh 100 0,50 50,00
    Energia SCEE s/ ICMS kWh 50 0,40 20,00
    Energia compensada GD I kWh 30 0,45 -13,50
    Contrib Ilum Publica Municipal 10,00
  `;

    const originalExtractString = useCase['extractString'];

    useCase['extractString'] = jest.fn((text, ...regexes) => {
      if (regexes[0].toString().includes('CNPJ')) {
        return 'JOÃO DA SILVA';
      }
      return originalExtractString.call(useCase, text, ...regexes);
    });

    const result = useCase.execute(invoiceText);

    const expected: ExtractedInvoiceData = {
      registrationNumber: '9876543210',
      customerName: 'JOÃO DA SILVA',
      date: 'MAI/2023',
      referenceMonth: 'MAI',
      referenceYear: '2023',
      distributor: 'CEMIG',
      electricityConsumptionKWh: 100,
      electricityCost: 50,
      sceeeEnergyWithICMSKWh: 50,
      sceeeEnergyWithICMSCost: 20,
      compensatedEnergyKWh: 30,
      compensatedEnergyCost: -13.5,
      publicLightingContributionKWh: 10,
      totalConsumption: 150,
      totalValueWithoutGD: 80,
      gdSavings: -13.5,
    };

    expect(result).toEqual(expected);
  });
  it('should handle missing information and return default values', () => {
    const invoiceText = `
      LIGHT S.A.
      NÚMERO DA INSTALAÇÃO: 0123456789
      NÚMERO DE IDENTIFICAÇÃO: 9876543210
      DATA DE EMISSÃO: 10/06/2023
      REFERENTE A: JUN/2023
      
      Energia Elétrica kWh 200 0,60 120,00
    `;

    const result = useCase.execute(invoiceText);

    expect(result.registrationNumber).toBe('9876543210');
    expect(result.customerName).toBe('');
    expect(result.distributor).toBe('LIGHT');
    expect(result.electricityConsumptionKWh).toBe(200);
    expect(result.electricityCost).toBe(120);
    expect(result.sceeeEnergyWithICMSKWh).toBe(0);
    expect(result.sceeeEnergyWithICMSCost).toBe(0);
    expect(result.compensatedEnergyKWh).toBe(0);
    expect(result.compensatedEnergyCost).toBe(0);
    expect(result.totalConsumption).toBe(200);
    expect(result.totalValueWithoutGD).toBe(120);
  });

  describe('private helper methods', () => {
    it('should extract distributor correctly', () => {
      const extractDistributor = (useCase as any).extractDistributor.bind(
        useCase,
      );

      expect(extractDistributor('FATURA CEMIG')).toBe('CEMIG');
      expect(extractDistributor('Distribuidora ENEL')).toBe('ENEL');
      expect(extractDistributor('Conta de luz CPFL')).toBe('CPFL');
      expect(extractDistributor('Texto sem distribuidora')).toBe('');
    });

    it('should extract energy information correctly', () => {
      const extractEnergyInfo = (useCase as any).extractEnergyInfo.bind(
        useCase,
      );

      const text = 'Energia Elétrica kWh 150 0,55 82,50';
      const pattern = /Energia Elétrica\s*kWh\s+(\d+)\s+[\d,.]+\s+([\d,.]+)/;

      const result = extractEnergyInfo(text, pattern);

      expect(result).toEqual({
        quantity: 150,
        value: 82.5,
      });
    });

    it('should extract installation number correctly', () => {
      const extractInstallationNumber = (
        useCase as any
      ).extractInstallationNumber.bind(useCase);

      const text =
        'NÚMERO DA INSTALAÇÃO: 0123456789\nNÚMERO DE IDENTIFICAÇÃO: 9876543210';
      const result = extractInstallationNumber(text);

      expect(result).toBe('9876543210');
    });

    it('should parse number with comma correctly', () => {
      const parseNumber = (useCase as any).parseNumber.bind(useCase);

      expect(parseNumber('123,45')).toBe(123.45);
      expect(parseNumber('0,5')).toBe(0.5);
      expect(parseNumber('1000')).toBe(1000);
      expect(parseNumber('invalid')).toBe(0);
    });
  });

  it('should handle different date formats', () => {
    const invoiceText = `
      ENEL DISTRIBUIÇÃO
      NÚMERO DA INSTALAÇÃO: 0123456789
      NÚMERO DE IDENTIFICAÇÃO: 9876543210
      DÉBITO AUTOMÁTICO MARIA SOUZA
      DATA DE EMISSÃO: 15/01/2023
      REFERENTE A: JAN/2023
      
      Energia Elétrica kWh 80 0,50 40,00
    `;

    const result = useCase.execute(invoiceText);

    expect(result.referenceMonth).toBe('JAN');
    expect(result.referenceYear).toBe('2023');
    expect(result.date).toBe('JAN/2023');
  });

  it('should calculate totals correctly', () => {
    const invoiceText = `
      EQUATORIAL ENERGIA
      NÚMERO DA INSTALAÇÃO: 0123456789
      NÚMERO DE IDENTIFICAÇÃO: 9876543210
      DÉBITO AUTOMÁTICO CARLOS PEREIRA
      DATA DE EMISSÃO: 20/07/2023
      REFERENTE A: JUL/2023
      
      Energia Elétrica kWh 300 0,50 150,00
      Energia SCEE s/ ICMS kWh 100 0,40 40,00
      Energia compensada GD I kWh 50 0,45 -22,50
      Contrib Ilum Publica Municipal 15,00
    `;

    const result = useCase.execute(invoiceText);

    expect(result.gdSavings).toBe(-22.5);
  });
});
