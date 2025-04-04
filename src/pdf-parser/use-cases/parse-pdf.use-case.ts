export interface ParsePdfRequest {
  pdfKey: string;
}

export interface ParsePdfUseCase {
  execute(request: ParsePdfRequest);
}
