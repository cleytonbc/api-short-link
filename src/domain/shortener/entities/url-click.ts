import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UrlClickProps {
  shortenedUrlId: UniqueEntityID;
  ipAddress?: string | null;
  userAgent?: string | null;
  clickedAt: Date;
}

export class UrlClick extends Entity<UrlClickProps> {
  get shortenedUrlId() {
    return this.props.shortenedUrlId;
  }

  set shortenedUrlId(newShortenedUrlId: UniqueEntityID) {
    this.props.shortenedUrlId = newShortenedUrlId;
  }

  get clickedAt() {
    return this.props.clickedAt;
  }

  set clickedAt(date: Date) {
    this.props.clickedAt = date;
  }

  get ipAddress(): string | undefined | null {
    return this.props.ipAddress;
  }

  set ipAddress(newIpAddress: string) {
    this.props.ipAddress = newIpAddress;
  }

  get userAgent(): string | undefined | null {
    return this.props.userAgent;
  }

  set userAgent(newUserAgent: string) {
    this.props.userAgent = newUserAgent;
  }

  static create(
    props: Optional<UrlClickProps, 'clickedAt' | 'ipAddress' | 'userAgent'>,
    id?: UniqueEntityID,
  ) {
    const shortenedUrl = new UrlClick(
      {
        ...props,
        clickedAt: props.clickedAt ?? new Date(),
        ipAddress: props.ipAddress ?? null,
        userAgent: props.userAgent ?? null,
      },
      id,
    );

    return shortenedUrl;
  }
}
