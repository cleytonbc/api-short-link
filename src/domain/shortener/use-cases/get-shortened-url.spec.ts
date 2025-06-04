import { GetShortenedUrlUseCase } from './get-shortened-url';
import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';
import { makeShortenedUrl } from '@test/factories/make-shortened-url';
import { UrlNotFoundError } from '../errors/url-not-found-error';

describe('GetShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let getShortenedUrlUseCase: GetShortenedUrlUseCase;

  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    getShortenedUrlUseCase = new GetShortenedUrlUseCase(shortenedUrlRepository);
  });

  it('Deve retornar o a url original criada pelo encurtador', async () => {
    const shortenedUrl = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl);

    const result = await getShortenedUrlUseCase.execute(shortenedUrl.shortCode);

    expect(result).toBe(shortenedUrl.originalUrl);
  });

  it('Deve contar o numero de cliques', async () => {
    const shortenedUrl = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl);

    const result = await getShortenedUrlUseCase.execute(shortenedUrl.shortCode);

    expect(result).toBe(shortenedUrl.originalUrl);

    const shortenedUrlUpdated1 = await shortenedUrlRepository.findByShortCode(
      shortenedUrl.shortCode,
    );

    expect(shortenedUrlUpdated1?.clickCount).toBe(1);

    await getShortenedUrlUseCase.execute(shortenedUrl.shortCode);

    const shortenedUrlUpdated2 = await shortenedUrlRepository.findByShortCode(
      shortenedUrl.shortCode,
    );

    expect(shortenedUrlUpdated2?.clickCount).toBe(2);
  });

  it('Deve retornar um erro quando a url não existir', async () => {
    await expect(
      getShortenedUrlUseCase.execute('non-existent'),
    ).rejects.toThrow(UrlNotFoundError);
  });
});
