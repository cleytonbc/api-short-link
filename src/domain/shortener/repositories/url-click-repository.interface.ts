import { UrlClick } from '../entities/url-click';

export abstract class IUrlClickRepository {
  abstract findById(id: string): Promise<UrlClick | null>;
  abstract findByShortenedUrlId(shortenedUrlId: string): Promise<UrlClick[]>;
  abstract create(urlClick: UrlClick): Promise<UrlClick>;
}
