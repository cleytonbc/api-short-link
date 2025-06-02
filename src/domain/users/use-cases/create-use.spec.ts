import { makeUser } from '@test/factories/make-user';
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error';
import { CreateUserUseCase } from './create-user';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { InvalidEmailError } from '../errors/invalid-email-error';
import { vi } from 'vitest';
import * as passwordHasher from '../helpers/password-hasher';

describe('CreateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let createUser: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUser = new CreateUserUseCase(userRepository);
  });

  it('Deve criar um novo usuário', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const result = await createUser.execute(userData);

    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
    expect(result.password).not.toBe(userData.password);
    expect(userRepository.items).toHaveLength(1);
  });

  it('Não deve criar usuário com e-mail inválido', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    };

    await expect(createUser.execute(userData)).rejects.toThrow(
      InvalidEmailError,
    );

    expect(userRepository.items).toHaveLength(0);
  });

  it('Não deverá criar e-mail que já cadastrado', async () => {
    const existingEmail = 'john@example.com';
    const newUser = makeUser({ email: existingEmail });
    userRepository.items.push(newUser);

    const userData = {
      name: 'Another John',
      email: existingEmail,
      password: 'password123',
    };

    await expect(createUser.execute(userData)).rejects.toThrow(
      EmailAlreadyExistsError,
    );

    expect(userRepository.items).toHaveLength(1);
  });

  it('Deve fazer o hash da senha ao criar um usuário.', async () => {
    const password = 'password123';
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password,
    };

    const hashSpy = vi.spyOn(passwordHasher, 'hashPassword');

    await createUser.execute(userData);

    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledWith(password);
  });
});
