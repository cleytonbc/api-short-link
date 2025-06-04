import { InMemoryShortenedUrlRepository } from "@test/repositories/in-memory-shortened-url-repository";
import { UpdateShortenedUrlUseCase } from "./update-shortened-url";
import { makeShortenedUrl } from "@test/factories/make-shortened-url";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { makeUser } from "@test/factories/make-user";
import { UrlNotFoundError } from "../errors/url-not-found-error";

describe('UpdateShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let updateShortenedUrlUseCase: UpdateShortenedUrlUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    userRepository = new InMemoryUserRepository();
    updateShortenedUrlUseCase = new UpdateShortenedUrlUseCase(
      shortenedUrlRepository,
    );
  });
  it('Deve ser possível atualizar uma url encurtada', async () => {
    const creationDate = new Date()
    const user = makeUser();
    await userRepository.create(user);

    const shortenedUrl = makeShortenedUrl({
      originalUrl: 'https://www.bing.com',
      userId: user.id,
      updatedAt: creationDate
    });

    await shortenedUrlRepository.create(shortenedUrl);

    const result = await updateShortenedUrlUseCase.execute({
      id: shortenedUrl.id.toValue(),
      originalUrl: 'https://www.google.com',
      userId: user.id.toValue(),
    });

    expect(result.originalUrl).toBe('https://www.google.com');
    expect(result.shortCode).toBe(shortenedUrl.shortCode);
    expect(result.updatedAt).not.toBe(creationDate);
  });
  it('Deve retornar um erro quando a url não existir', async () => {
    const user = makeUser();
    await userRepository.create(user);

    await expect(updateShortenedUrlUseCase.execute({
      id: 'non-existent',
      originalUrl: 'https://www.google.com',
      userId: user.id.toValue(),
    })).rejects.toThrow(UrlNotFoundError);
  });
  it('Deve retornar um erro quando a url não pertencer ao usuário', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const shortenedUrl = makeShortenedUrl({
      originalUrl: 'https://www.google.com',
      userId: user.id,
    });

    await shortenedUrlRepository.create(shortenedUrl);

    await expect(updateShortenedUrlUseCase.execute({
      id: shortenedUrl.id.toValue(),
      originalUrl: 'https://www.bing.com',
      userId: 'any-id',
    })).rejects.toThrow(UrlNotFoundError);
  });
});