export interface ReadInvoiceFileRequest {
  key: string;
}

export interface ReadInvoiceFileUseCase {
  execute(request: ReadInvoiceFileRequest): Promise<void>;
}
