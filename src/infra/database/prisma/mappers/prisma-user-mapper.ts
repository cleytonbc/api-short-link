import { User as PrismaUser, Prisma } from '@generated/prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/users/entities/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        lastLoginAt: raw.lastLoginAt ?? null,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt ?? null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt ?? null,
      deletedAt: user.deletedAt ?? null,
    };
  }
}
