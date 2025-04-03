export interface File {
  mimetype: string;
  size: number;
  buffer: Buffer;
  path: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  destination: string;
}

export interface UploadFileRequest {
  file: File;
}

export interface UploadFileInterceptor {
  execute(request: UploadFileRequest);
}
