import { UploadFileUseCase } from 'src/file/application/upload-file.use-case';
import {
  UploadFileInterceptor,
  UploadFileRequest,
} from '../upload-file.interceptor';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class UploadFileInterceptorImpl
  implements UploadFileInterceptor, NestInterceptor
{
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request['url'] = await this.execute(request as UploadFileRequest);

    return next.handle().pipe();
  }

  async execute(request: UploadFileRequest) {
    try {
      await this.uploadFileUseCase.execute(request);
    } catch (error) {
      console.error('Erro ao fazer upload de arquivo:', error);
      throw new Error('Não foi possível fazer upload do arquivo');
    }
  }
}
