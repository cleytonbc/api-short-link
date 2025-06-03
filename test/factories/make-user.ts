import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/users/entities/user';
import { hashPassword } from '@/domain/users/helpers/password-hasher';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

type Override = Partial<{
  name: string;
  email: string;
  password: string;
}>;

export function makeUser(override: Override = {}, id?: UniqueEntityID): User {
  return User.create(
    {
      name: override.name ?? faker.person.fullName(),
      email: override.email ?? faker.internet.email(),
      password: override.password ?? '123456',
    },
    id,
  );
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(
    data: Override = {},
    id?: UniqueEntityID,
  ): Promise<User> {
    const user = makeUser(data, id);

    user.password = await hashPassword(user.password);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
