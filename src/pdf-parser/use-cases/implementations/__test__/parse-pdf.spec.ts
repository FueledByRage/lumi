import { Readable } from 'stream';
import {
  ParsePdfUseCaseImpl,
  PdfParser,
} from '../parse-pdf-implementation.use-case';
import { GetFileReadableUseCase } from 'src/file/use-cases/get-file-readable.use-case';

describe('ParsePdfUseCaseImpl', () => {
  let useCase: ParsePdfUseCaseImpl;
  let getFileReadableUseCase: jest.Mocked<GetFileReadableUseCase>;
  let pdfParser: jest.Mocked<PdfParser>;

  beforeEach(() => {
    getFileReadableUseCase = {
      execute: jest.fn(),
    };

    pdfParser = {
      parse: jest.fn(),
    };

    useCase = new ParsePdfUseCaseImpl(getFileReadableUseCase, pdfParser);
  });

  it('deve retornar o texto do PDF corretamente', async () => {
    const mockText = 'Conteúdo do PDF';
    pdfParser.parse.mockResolvedValueOnce(mockText);

    const pdfContent = Buffer.from('PDF fake');
    const readable = new Readable();
    readable.push(pdfContent);
    readable.push(null);

    getFileReadableUseCase.execute.mockResolvedValueOnce(readable);

    const result = await useCase.execute({ pdfKey: 'arquivo.pdf' });

    expect(result).toBe(mockText);
    expect(getFileReadableUseCase.execute).toHaveBeenCalledWith({
      fileKey: 'arquivo.pdf',
    });
    expect(pdfParser.parse).toHaveBeenCalledWith(pdfContent);
  });

  it('deve lançar erro ao falhar ao processar PDF', async () => {
    getFileReadableUseCase.execute.mockRejectedValueOnce(
      new Error('Falha ao abrir stream'),
    );

    await expect(useCase.execute({ pdfKey: 'erro.pdf' })).rejects.toThrow(
      'Falha ao processar o arquivo',
    );
  });
});
