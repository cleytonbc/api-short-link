import { ShortenedUrl } from '../entities/shortened-url';
import { UrlClick } from '../entities/url-click';

export abstract class IShortenedUrlRepository {
  abstract findById(id: string): Promise<ShortenedUrl | null>;
  abstract findByShortCode(
    shortCode: string,
    includeDeleted?: boolean,
  ): Promise<ShortenedUrl | null>;
  abstract findByUserId(userId: string): Promise<ShortenedUrl[]>;
  abstract findAll(): Promise<ShortenedUrl[]>;
  abstract incrementClickCountAndCreateUrlClick(
    id: string,
    urlClick: UrlClick,
  ): Promise<ShortenedUrl | null>;
  abstract create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>;
  abstract save(shortenedUrl: ShortenedUrl): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
}
