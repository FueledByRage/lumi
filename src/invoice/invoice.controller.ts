import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HandleInvoiceUploadUseCase } from './use-cases/handle-invoice-upload.use-case';
import { UploadFileInterceptorImpl } from 'src/shared/infrastructure/interceptor/implementation/upload-file-interceptor';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FindDashboardSummaryUseCase } from './use-cases/find-dashboard-summary.use-case';
import { DashboardSummaryRequestDto } from './dto/invoices-summaty-request.dto';
import { GetMonthlyDataUseCase } from './use-cases/get-monthly-data.use-case';
import { GetMonthlyDataRequest } from './dto/invoices-monthly-data-request.dto';

export interface UploadedFile {
  url: string;
  key: string;
}

@Controller('invoices')
export class InvoiceController {
  constructor(
    @Inject('HandleInvoiceUploadUseCase')
    private readonly handleInvoiceUploadRequest: HandleInvoiceUploadUseCase,
    @Inject('FindDashboardSummaryUseCase')
    private readonly findDashboardSummaryUseCase: FindDashboardSummaryUseCase,
    @Inject('GetMonthlyDataUseCase')
    private readonly getMonthlyDataUseCase: GetMonthlyDataUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), UploadFileInterceptorImpl)
  async uploadInvoice(@UploadedFile() file: UploadedFile) {
    return await this.handleInvoiceUploadRequest.execute(file);
  }

  @Get('dashboard-summary')
  async getDashboardSummary(@Query() query: DashboardSummaryRequestDto) {
    return await this.findDashboardSummaryUseCase.execute(query);
  }

  @Get('monthly-data')
  async getMonthlyData(@Query() query: GetMonthlyDataRequest) {
    return this.getMonthlyDataUseCase.execute(query);
  }
}
