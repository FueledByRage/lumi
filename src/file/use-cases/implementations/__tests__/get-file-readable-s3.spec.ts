import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { GetFileReadableS3UseCaseImpl } from '../get-file-readable-s3.use-case';

describe('GetFileReadableS3UseCaseImpl', () => {
  let s3ClientMock: jest.Mocked<S3Client>;
  let useCase: GetFileReadableS3UseCaseImpl;

  beforeEach(() => {
    s3ClientMock = {
      send: jest.fn().mockResolvedValue({
        Body: ['LOREM'],
      }),
    } as unknown as jest.Mocked<S3Client>;

    useCase = new GetFileReadableS3UseCaseImpl(s3ClientMock);
  });

  it('should call S3', async () => {
    await useCase.execute({
      fileKey: 'file.txt',
      contentType: 'text/plain',
    });

    expect(s3ClientMock.send).toHaveBeenCalledWith(
      expect.any(GetObjectCommand),
    );
  });

  it('should throw an error when S3 call fails', async () => {
    s3ClientMock.send.mockRejectedValue(new Error('S3 error') as never);

    await expect(
      useCase.execute({ fileKey: 'fail.txt', contentType: 'text/plain' }),
    ).rejects.toThrow('Falha ao recuperar o arquivo');

    expect(s3ClientMock.send).toHaveBeenCalled();
  });
});
