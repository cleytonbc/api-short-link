import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';
import { CreateShortenedUrlUseCase } from './create-shortened-url';
import { GenerateUniqueShortCodeService } from '../services/generate-unique-short-code.service';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { makeUser } from '@test/factories/make-user';
import { UserDoesNotExistError } from '../errors/user-not-found-error';

describe('CreateShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let createShortenedUrlUseCase: CreateShortenedUrlUseCase;
  let generateUniqueShortCodeService: GenerateUniqueShortCodeService;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    generateUniqueShortCodeService = new GenerateUniqueShortCodeService(
      shortenedUrlRepository,
    );
    userRepository = new InMemoryUserRepository();
    createShortenedUrlUseCase = new CreateShortenedUrlUseCase(
      shortenedUrlRepository,
      generateUniqueShortCodeService,
      userRepository,
    );
  });

  it('Deve criar uma nova url encurtada', async () => {
    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
    });

    expect(result.shortCode).toBeDefined();
    expect(result.shortCode).toHaveLength(6);
    expect(result.originalUrl).toBe('www.google.com');
    expect(result.userId).not.toBeDefined();
  });
  it('Deve associar um usuário url criada, caso ele exista', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
      userId: user.id.toString(),
    });

    expect(result.shortCode).toBeDefined();
    expect(result.originalUrl).toBeDefined();
    expect(result.userId?.toString()).toBe(user.id.toString());
  });
  it("Deve iniciar com 0 o número de click's ", async () => {
    const result = await createShortenedUrlUseCase.execute({
      originalUrl: 'www.google.com',
    });

    expect(result.shortCode).toBeDefined();
    expect(result.originalUrl).toBeDefined();
    expect(result.clickCount).toBe(0);
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
