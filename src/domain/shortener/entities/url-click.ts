import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface UrlClickProps {
  shortenedUrlId: UniqueEntityID;
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

  static create(
    props: Optional<UrlClickProps, 'clickedAt'>,
    id?: UniqueEntityID,
  ) {
    const shortenedUrl = new UrlClick(
      {
        ...props,
        clickedAt: props.clickedAt ?? new Date(),
      },
      id,
    );

    return shortenedUrl;
  }
}
