import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { generateShortCode } from '../helpers/generate-short-code';
import { ShortenedUrl } from '../entities/shortened-url';

@Injectable()
export class GenerateUniqueShortCodeService {
  constructor(private shortenedUrlRepository: IShortenedUrlRepository) {}

  async execute(): Promise<string> {
    const MAX_ATTEMPTS = 10;
    let shortCode: string;
    let attempts = 0;
    let shortCodeExist: ShortenedUrl | null;

    do {
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error(
          'Failed to generate a unique short code after 10 attempts.',
        );
      }

      shortCode = generateShortCode();
      shortCodeExist =
        await this.shortenedUrlRepository.findByShortCode(shortCode, true);
      attempts++;
    } while (shortCodeExist);

    return shortCode;
  }
}
