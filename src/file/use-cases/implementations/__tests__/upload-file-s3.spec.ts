import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UploadFileS3UseCaseImpl } from '../upload-file-s3-use-case';

jest.mock('@aws-sdk/s3-request-presigner');

describe('UploadFileS3UseCaseImpl', () => {
  let s3ClientMock: jest.Mocked<S3Client>;
  let useCase: UploadFileS3UseCaseImpl;

  const mockFile = {
    originalname: 'test.png',
    mimetype: 'image/png',
    buffer: Buffer.from('file content'),
    size: 1234,
    path: 'path/to/file',
    fieldname: 'file',
    encoding: '7bit',
    destination: 'uploads',
  };

  const expectedFolder = 'uploads';

  beforeEach(() => {
    process.env.S3_BUCKET_NAME = 'my-bucket';
    process.env.S3_FOLDER = expectedFolder;

    s3ClientMock = {
      send: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<S3Client>;

    (getSignedUrl as jest.Mock).mockResolvedValue('https://signed-url.com');

    useCase = new UploadFileS3UseCaseImpl(s3ClientMock);
  });

  it('should upload file to S3 and return key + signed URL', async () => {
    const result = await useCase.execute({ file: mockFile });

    expect(s3ClientMock.send).toHaveBeenCalledWith(
      expect.any(PutObjectCommand),
    );
    expect(getSignedUrl).toHaveBeenCalledWith(
      s3ClientMock,
      expect.any(GetObjectCommand),
      { expiresIn: 3600 },
    );
    expect(result).toHaveProperty('key');
    expect(result.url).toBe('https://signed-url.com');
  });

  it('should throw an error if upload fails', async () => {
    s3ClientMock.send.mockRejectedValueOnce(new Error('S3 error') as never);

    await expect(useCase.execute({ file: mockFile })).rejects.toThrow(
      'Não foi possível fazer upload do arquivo',
    );

    expect(s3ClientMock.send).toHaveBeenCalled();
  });

  it('should throw an error if signed URL generation fails', async () => {
    (getSignedUrl as jest.Mock).mockRejectedValueOnce(
      new Error('Presign fail') as never,
    );

    await expect(useCase.execute({ file: mockFile })).rejects.toThrow(
      'Não foi possível fazer upload do arquivo',
    );

    expect(getSignedUrl).toHaveBeenCalled();
  });
});
