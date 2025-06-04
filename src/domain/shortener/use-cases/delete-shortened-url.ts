import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { UrlNotFoundError } from '../errors/url-not-found-error';

export interface DeleteShortenedUrlRequest {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteShortenedUrlUseCase {
  constructor(
    private shortenedUrlRepository: IShortenedUrlRepository,
  ) {}

  async execute({id, userId}: DeleteShortenedUrlRequest): Promise<void> {
    const shortenedUrlExist = await this.shortenedUrlRepository.findById(id);

    if (!shortenedUrlExist || shortenedUrlExist.userId?.toValue() !== userId) {
      throw new UrlNotFoundError();
    }

    await this.shortenedUrlRepository.softDelete(id);
  }
}