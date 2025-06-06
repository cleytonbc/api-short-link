import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';
import { CreateShortenedUrlUseCase } from './create-shortened-url';
import { GenerateUniqueShortCodeService } from '../services/generate-unique-short-code.service';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { makeUser } from '@test/factories/make-user';
import { UserDoesNotExistError } from '../errors/user-not-found-error';
import { Env } from '@/infra/env/env';
import { EnvService } from '@/infra/env/env.service';
import { vi } from 'vitest';

describe('CreateShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let createShortenedUrlUseCase: CreateShortenedUrlUseCase;
  let generateUniqueShortCodeService: GenerateUniqueShortCodeService;
  let userRepository: InMemoryUserRepository;
  let envServiceMock: EnvService;

  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    generateUniqueShortCodeService = new GenerateUniqueShortCodeService(
      shortenedUrlRepository,
    );

    userRepository = new InMemoryUserRepository();
    envServiceMock = {
      get: vi.fn().mockImplementation((key: keyof Env) => {
        if (key === 'API_BASE_URL') return 'http://localhost:3000';
        return '';
      }),
    } as unknown as EnvService;
    createShortenedUrlUseCase = new CreateShortenedUrlUseCase(
      shortenedUrlRepository,
      generateUniqueShortCodeService,
      userRepository,
      envServiceMock,
    );
  });

  it('Deve criar uma nova url encurtada', async () => {
    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
    });

    expect(typeof result).toBe('string');
    const shortCode = result.split('/').pop();
    const entity = shortenedUrlRepository.items.find(
      (item) => item.shortCode === shortCode,
    );
    expect(entity).toBeDefined();
    expect(entity?.originalUrl).toBe('www.google.com');
    expect(entity?.userId).toBeUndefined();
  });
  it('Deve associar um usuário url criada, caso ele exista', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
      userId: user.id.toString(),
    });

    const shortCode = result.split('/').pop();
    const entity = shortenedUrlRepository.items.find(
      (item) => item.shortCode === shortCode,
    );

    expect(entity).toBeDefined();
    expect(entity?.userId?.toString()).toBe(user.id.toString());
  });
  it("Deve iniciar com 0 o número de click's ", async () => {
    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
    });

    const shortCode = result.split('/').pop();
    const entity = shortenedUrlRepository.items.find(
      (item) => item.shortCode === shortCode,
    );

    expect(entity).toBeDefined();
    expect(entity?.clickCount).toBe(0);
  });
  it('Não Deve criar um nome encurtador url caso o  usuário informado seja inválido ', async () => {
    await expect(
      createShortenedUrlUseCase.execute({
        originalUrl: 'www.google.com',
        userId: 'any-id',
      }),
    ).rejects.toThrow(UserDoesNotExistError);
  });
});
