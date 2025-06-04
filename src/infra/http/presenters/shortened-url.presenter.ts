import { ShortenedUrl } from '@/domain/shortener/entities/shortened-url';

export class ShortenedUrlPresenter {
  static toHTTP(shortenedUrl: ShortenedUrl) {
    return {
      id: shortenedUrl.id.toString(),
      shortCode: shortenedUrl.shortCode,
      originalUrl: shortenedUrl.originalUrl,
      clickCount: shortenedUrl.clickCount,
      userId: shortenedUrl.userId?.toString(),
      createdAt: shortenedUrl.createdAt,
      updatedAt: shortenedUrl.updatedAt,
    };
  }
}
