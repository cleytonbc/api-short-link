import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { UrlNotFoundError } from '../errors/url-not-found-error';
import { UrlClick } from '../entities/url-click';

type IGetShortenedUrlUseCase = {
  code: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class GetShortenedUrlUseCase {
  constructor(private shortenedUrlRepository: IShortenedUrlRepository) {}

  async execute({
    code,
    ipAddress,
    userAgent,
  }: IGetShortenedUrlUseCase): Promise<string> {
    const shortenedUrlExist =
      await this.shortenedUrlRepository.findByShortCode(code);

    if (!shortenedUrlExist) {
      throw new UrlNotFoundError();
    }

    const urlClick = UrlClick.create({
      shortenedUrlId: shortenedUrlExist.id,
      ipAddress,
      userAgent,
    });

    const shortenedUrlId = shortenedUrlExist.id.toValue();

    const updatedShortenedUrl =
      await this.shortenedUrlRepository.incrementClickCountAndCreateUrlClick(
        shortenedUrlId,
        urlClick,
      );

    if (!updatedShortenedUrl) {
      throw new UrlNotFoundError();
    }

    return shortenedUrlExist.originalUrl;
  }
}
