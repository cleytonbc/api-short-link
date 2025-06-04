import { ShortenedUrl } from '@/domain/shortener/entities/shortened-url';
import { IShortenedUrlRepository } from '@/domain/shortener/repositories/shortened-url-repository.interface';

export class InMemoryShortenedUrlRepository implements IShortenedUrlRepository {
  public items: ShortenedUrl[] = [];
  private deletedShortenedUrl: Map<string, ShortenedUrl> = new Map();

  async findById(id: string): Promise<ShortenedUrl | null> {
    const shortenedUrl = this.items.find(
      (item) => item.id.toValue() === id && item.deletedAt === null,
    );
    return Promise.resolve(shortenedUrl || null);
  }

  async findByShortCode(shortCode: string): Promise<ShortenedUrl | null> {
    const shortenedUrl = this.items.find(
      (item) => item.shortCode === shortCode && !item.deletedAt,
    );
    return Promise.resolve(shortenedUrl || null);
  }

  async findByUserId(userId: string): Promise<ShortenedUrl[]> {
    return Promise.resolve(
      this.items.filter(
        (item) => item.userId?.toString() === userId && !item.deletedAt,
      ),
    );
  }

  async findAll(): Promise<ShortenedUrl[]> {
    return Promise.resolve(this.items.filter((item) => !item.deletedAt));
  }

  async create(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    this.items.push(shortenedUrl);
    return Promise.resolve(shortenedUrl);
  }

  async save(shortenedUrl: ShortenedUrl): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex(
        (item) => item.id.toValue() === shortenedUrl.id.toValue(),
      ),
    );

    if (itemIndex >= 0) {
      this.items[itemIndex] = shortenedUrl;
    }
  }

  async delete(id: string): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex((item) => item.id.toValue() === id),
    );

    if (itemIndex >= 0) {
      const deleted = this.items[itemIndex];
      this.deletedShortenedUrl.set(id, deleted);

      this.items.splice(itemIndex, 1);
    }
  }

  async softDelete(id: string): Promise<void> {
    const itemIndex = await Promise.resolve(
      this.items.findIndex((item) => item.id.toValue() === id),
    );

    if (itemIndex >= 0) {
      this.items[itemIndex].softDelete();
    }
  }
}
