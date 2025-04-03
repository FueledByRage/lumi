export interface ParsePdfRequest {
  pdfUrl: string;
}

export interface ParsePdfUseCase {
  execute(request: ParsePdfRequest);
}
