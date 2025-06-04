import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { UrlNotFoundError } from '../errors/url-not-found-error';

@Injectable()
export class GetShortenedUrlUseCase {
  constructor(
    private shortenedUrlRepository: IShortenedUrlRepository,
  ) {}

  async execute(code: string): Promise<string> {
    const shortenedUrlExist =
      await this.shortenedUrlRepository.findByShortCode(code);

    if (!shortenedUrlExist) {
      throw new UrlNotFoundError();
    }

    shortenedUrlExist.incrementClickCount();

    await this.shortenedUrlRepository.save(shortenedUrlExist);

    return shortenedUrlExist.originalUrl;
  }
}
