export interface ReadInvoiceFileRequest {
  fileUrl: string;
}

export interface ReadInvoiceFileUseCase {
  execute(request: ReadInvoiceFileRequest): Promise<void>;
}
