import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { VwUrlClicksSummary } from '@/domain/shortener/entities/vw-url-clicks-summary';
import { faker } from '@faker-js/faker';

type Override = Partial<{
  id: string;
  userId: string;
  shortenedUrlId: string;
  shortCode: string;
  clickCount: number;
  clickDate: Date;
  clickHour: number;
  createdAt: Date;
  originalUrl: string;
  userEmail: string;
  userName: string;
}>;

export function makeVwUrlClicksSummary(
  override: Override = {},
): VwUrlClicksSummary {
  return VwUrlClicksSummary.create({
    id: override.id ?? new UniqueEntityID().toString(),
    userId: override.userId ?? new UniqueEntityID().toString(),
    shortenedUrlId: override.shortenedUrlId ?? new UniqueEntityID().toString(),
    shortCode: override.shortCode ?? faker.string.nanoid(6),
    clickCount: override.clickCount ?? faker.number.int({ min: 0, max: 1000 }),
    clickDate: override.clickDate ?? faker.date.recent(),
    clickHour: override.clickHour ?? faker.number.int({ min: 0, max: 23 }),
    createdAt: override.createdAt ?? new Date(),
    originalUrl: override.originalUrl ?? faker.internet.url(),
    userEmail: override.userEmail ?? faker.internet.email(),
    userName: override.userName ?? faker.person.fullName(),
  });
}
