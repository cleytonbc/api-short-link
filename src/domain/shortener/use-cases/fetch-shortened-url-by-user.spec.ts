import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';
import { makeShortenedUrl } from '@test/factories/make-shortened-url';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { FetchShortenedUrlByIdUseCase } from './fetch-shortened-url-by-user';
import { makeUser } from '@test/factories/make-user';
import { UserDoesNotExistError } from '../errors/user-not-found-error';

describe('GetShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let userRepository: InMemoryUserRepository;
  let fetchShortenedUrl: FetchShortenedUrlByIdUseCase;

  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    userRepository = new InMemoryUserRepository();
    fetchShortenedUrl = new FetchShortenedUrlByIdUseCase(
      shortenedUrlRepository,
      userRepository,
    );
  });

  it('Deve retornar o as urls do usuário', async () => {
    const user = makeUser();
    await userRepository.create(user);
    const shortenedUrl = makeShortenedUrl({
      userId: user.id,
    });
    await shortenedUrlRepository.create(shortenedUrl);
    const shortenedUrl2 = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl2);
    const shortenedUrl3 = makeShortenedUrl({
      userId: user.id,
    });
    await shortenedUrlRepository.create(shortenedUrl3);

    const result = await fetchShortenedUrl.execute(user.id.toValue());

    expect(result).toHaveLength(2);
  });

  it('Deve retornar um erro quando o usuário não existir', async () => {
    await expect(fetchShortenedUrl.execute('non-existent')).rejects.toThrow(
      UserDoesNotExistError,
    );
  });
});
