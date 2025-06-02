import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/users/entities/user';
import { faker } from '@faker-js/faker';

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
