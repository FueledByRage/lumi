import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';
import * as path from 'path';
import * as fs from 'fs';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/invoices/upload (POST)', () => {
    it('should upload a file and trigger processing', async () => {
      const filePath = path.join(__dirname, 'fixtures', 'Invoice.pdf');

      expect(fs.existsSync(filePath)).toBe(true);

      const response = await request(app.getHttpServer())
        .post('/invoices/upload')
        .attach('file', filePath);

      expect(response.status).toBe(201);
    });
  });

  describe('/invoices/dashboard-summary (GET)', () => {
    it('should return dashboard summary', async () => {
      const response = await request(app.getHttpServer())
        .get('/invoices/dashboard-summary')
        .query({
          customerId: 'some-customer-id',
          year: 2024,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalInvoices');
      expect(response.body).toHaveProperty('totalValue');
    });
  });

  describe('/invoices/monthly-data (GET)', () => {
    it('should return monthly data', async () => {
      const response = await request(app.getHttpServer())
        .get('/invoices/monthly-data')
        .query({
          customerId: 'some-customer-id',
          year: 2024,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
