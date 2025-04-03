import { Readable } from 'stream';

export interface GetFileReadableRequest {
  fileKey: string;
}

export interface GetFileReadableUseCase {
  execute(request: GetFileReadableRequest): Promise<Readable>;
}
