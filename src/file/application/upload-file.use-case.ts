export interface File {
  mimeType: string;
  size: number;
  buffer: Buffer;
  path: string;
  fieldname: string;
  originalName: string;
  encoding: string;
  destination: string;
}

export interface UploadFileRequest {
  file: File;
}

export interface UploadFileOutput {
  key: string;
  url: string;
}

export interface UploadFileUseCase {
  execute(params: UploadFileRequest): Promise<UploadFileOutput>;
}
