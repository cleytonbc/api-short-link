import { GetShortenedUrlUseCase } from './get-shortened-url';
import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';
import { makeShortenedUrl } from '@test/factories/make-shortened-url';
import { UrlNotFoundError } from '../errors/url-not-found-error';
import { InMemoryUrlClickRepository } from '@test/repositories/in-memory-url-click-repository';
import { IUrlClickRepository } from '../repositories/url-click-repository.interface';

describe('GetShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let getShortenedUrlUseCase: GetShortenedUrlUseCase;
  let UrlClickRepository: IUrlClickRepository;

  beforeEach(() => {
    UrlClickRepository = new InMemoryUrlClickRepository();
    shortenedUrlRepository = new InMemoryShortenedUrlRepository(
      UrlClickRepository,
    );
    getShortenedUrlUseCase = new GetShortenedUrlUseCase(shortenedUrlRepository);
  });

  it('Deve retornar o a url original criada pelo encurtador', async () => {
    const shortenedUrl = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl);

    const result = await getShortenedUrlUseCase.execute({
      code: shortenedUrl.shortCode,
    });

    expect(result).toBe(shortenedUrl.originalUrl);
  });

  it('Deve contar o numero de cliques', async () => {
    const shortenedUrl = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl);

    const result = await getShortenedUrlUseCase.execute({
      code: shortenedUrl.shortCode,
    });

    expect(result).toBe(shortenedUrl.originalUrl);

    const shortenedUrlUpdated1 = await shortenedUrlRepository.findByShortCode(
      shortenedUrl.shortCode,
    );

    expect(shortenedUrlUpdated1?.clickCount).toBe(1);

    await getShortenedUrlUseCase.execute({ code: shortenedUrl.shortCode });

    const shortenedUrlUpdated2 = await shortenedUrlRepository.findByShortCode(
      shortenedUrl.shortCode,
    );

    expect(shortenedUrlUpdated2?.clickCount).toBe(2);
  });

  it('Deve retornar um erro quando a url não existir', async () => {
    await expect(
      getShortenedUrlUseCase.execute({ code: 'non-existent' }),
    ).rejects.toThrow(UrlNotFoundError);
  });

  it('Deve criar um registro de clique', async () => {
    const shortenedUrl = makeShortenedUrl();
    await shortenedUrlRepository.create(shortenedUrl);

    const before = await UrlClickRepository.findByShortenedUrlId(
      shortenedUrl.id.toValue(),
    );

    expect(before).toHaveLength(0);
    const result = await getShortenedUrlUseCase.execute({
      code: shortenedUrl.shortCode,
    });

    expect(result).toBe(shortenedUrl.originalUrl);

    const after = await UrlClickRepository.findByShortenedUrlId(
      shortenedUrl.id.toValue(),
    );

    expect(after).toHaveLength(1);
  });
});
