import { UrlClick } from '@/domain/shortener/entities/url-click';
import { IUrlClickRepository } from '@/domain/shortener/repositories/url-click-repository.interface';

export class InMemoryUrlClickRepository implements IUrlClickRepository {
  public items: UrlClick[] = [];

  async findById(id: string): Promise<UrlClick | null> {
    const urlClick = this.items.find((item) => item.id.toValue() === id);
    return Promise.resolve(urlClick || null);
  }

  async findByShortenedUrlId(shortenedUrlId: string): Promise<UrlClick[]> {
    const urlClick = this.items.filter(
      (item) => item.shortenedUrlId.toString() === shortenedUrlId,
    );
    return Promise.resolve(urlClick || null);
  }

  async create(urlClick: UrlClick): Promise<UrlClick> {
    this.items.push(urlClick);
    return Promise.resolve(urlClick);
  }
}
