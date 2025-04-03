export interface HandleInvoiceUploadRequest {
  fileUrl: string;
}

export interface HandleInvoiceUploadUseCase {
  execute(request: HandleInvoiceUploadRequest): Promise<void>;
}
