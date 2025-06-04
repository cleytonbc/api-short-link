import { ShortenedUrl } from '../entities/shortened-url';

export abstract class IShortenedUrlRepository {
  abstract findById(id: string): Promise<ShortenedUrl | null>;
  abstract findByShortCode(
    shortCode: string,
    includeDeleted?: boolean,
  ): Promise<ShortenedUrl | null>;
  abstract findByUserId(userId: string): Promise<ShortenedUrl[]>;
  abstract findAll(): Promise<ShortenedUrl[]>;
  abstract create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>;
  abstract save(shortenedUrl: ShortenedUrl): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
}
