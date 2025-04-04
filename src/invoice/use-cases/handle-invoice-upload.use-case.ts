export interface HandleInvoiceUploadRequest {
  url: string;
  key: string;
}

export interface HandleInvoiceUploadUseCase {
  execute(request: HandleInvoiceUploadRequest): Promise<void>;
}
