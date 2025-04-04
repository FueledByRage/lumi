import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HandleInvoiceUploadUseCase } from './use-cases/handle-invoice-upload.use-case';
import { UploadFileInterceptorImpl } from 'src/shared/infrastructure/interceptor/implementation/upload-file-interceptor';
import { FileInterceptor } from '@nestjs/platform-express/multer';

export interface UploadedFile {
  url: string;
  key: string;
}

@Controller('invoices')
export class InvoiceController {
  constructor(
    @Inject('HandleInvoiceUploadUseCase')
    private readonly handleInvoiceUploadRequest: HandleInvoiceUploadUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), UploadFileInterceptorImpl)
  async uploadInvoice(@UploadedFile() file: UploadedFile) {
    return await this.handleInvoiceUploadRequest.execute(file);
  }
}
