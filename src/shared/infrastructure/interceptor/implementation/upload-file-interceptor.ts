import { UploadFileUseCase } from 'src/file/use-cases/upload-file.use-case';
import {
  UploadFileInterceptor,
  UploadFileRequest,
} from '../upload-file.interceptor';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UploadFileInterceptorImpl
  implements UploadFileInterceptor, NestInterceptor
{
  private readonly logger = new Logger(UploadFileInterceptorImpl.name);
  constructor(
    @Inject('UploadFileUseCase')
    private readonly uploadFileUseCase: UploadFileUseCase,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    this.validateFileType(request, [
      'pdf',
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]);

    request['file'] = await this.execute(request as UploadFileRequest);

    return next.handle().pipe();
  }

  async execute(request: UploadFileRequest) {
    try {
      return await this.uploadFileUseCase.execute(request);
    } catch (error) {
      this.logger.error('Erro ao fazer upload do arquivo', error);
      throw new Error('Não foi possível fazer upload do arquivo');
    }
  }

  private validateFileType(req: UploadFileRequest, allowedTypes: string[]) {
    const isValidFileType = allowedTypes.includes(req.file.mimetype);

    if (!isValidFileType) {
      this.logger.error(
        `Tipo de arquivo não suportado: ${req.file.mimetype}. Tipos suportados: ${allowedTypes.join(
          ', ',
        )}`,
      );
      throw new BadRequestException('Tipo de arquivo não suportado');
    }
  }
}
