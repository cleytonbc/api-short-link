import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ShortenedUrlProps {
  shortCode: string;
  originalUrl: string;
  userId?: UniqueEntityID;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class ShortenedUrl extends Entity<ShortenedUrlProps> {
  get shortCode() {
    return this.props.shortCode;
  }

  set shortCode(newShortCode: string) {
    this.props.shortCode = newShortCode;
  }

  get originalUrl() {
    return this.props.originalUrl;
  }

  set originalUrl(newOriginalUrl: string) {
    this.props.originalUrl = newOriginalUrl;
  }

  get userId(): UniqueEntityID | undefined {
    return this.props.userId;
  }

  set userId(newUserId: UniqueEntityID) {
    this.props.userId = newUserId;
  }

  get clickCount() {
    return this.props.clickCount;
  }

  set clickCount(newClickCount: number) {
    this.props.clickCount = newClickCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  incrementClickCount() {
    this.props.clickCount++;
  }

  softDelete() {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  restore() {
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      ShortenedUrlProps,
      'clickCount' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
    id?: UniqueEntityID,
  ) {
    const shortenedUrl = new ShortenedUrl(
      {
        ...props,
        clickCount: props.clickCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );

    return shortenedUrl;
  }
}
