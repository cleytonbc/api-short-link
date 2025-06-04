import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { UrlNotFoundError } from '../errors/url-not-found-error';
import { ShortenedUrl } from '../entities/shortened-url';

export interface UpdateShortenedUrlRequest {
  id: string;
  originalUrl: string;
  userId: string;
}

@Injectable()
export class UpdateShortenedUrlUseCase {
  constructor(private shortenedUrlRepository: IShortenedUrlRepository) {}

  async execute({
    id,
    originalUrl,
    userId,
  }: UpdateShortenedUrlRequest): Promise<ShortenedUrl> {
    const shortenedUrlExist = await this.shortenedUrlRepository.findById(id);

    if (!shortenedUrlExist || shortenedUrlExist.userId?.toValue() !== userId) {
      throw new UrlNotFoundError();
    }

    shortenedUrlExist.originalUrl = originalUrl;
    shortenedUrlExist.updatedAt = new Date();

    await this.shortenedUrlRepository.save(shortenedUrlExist);

    return shortenedUrlExist;
  }
}
