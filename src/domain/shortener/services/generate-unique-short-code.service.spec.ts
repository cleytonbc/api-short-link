import { describe, it, expect, vi } from 'vitest';
import { GenerateUniqueShortCodeService } from './generate-unique-short-code.service';
import { InMemoryShortenedUrlRepository } from '@test/repositories/in-memory-shortened-url-repository';

describe('GenerateUniqueShortCodeService', () => {
  let inMemoryShortenedUrlRepository: InMemoryShortenedUrlRepository;
  let generateUniqueShortCodeService: GenerateUniqueShortCodeService;
  beforeEach(() => {
    inMemoryShortenedUrlRepository = new InMemoryShortenedUrlRepository();
    generateUniqueShortCodeService = new GenerateUniqueShortCodeService(
      inMemoryShortenedUrlRepository,
    );
  });

  it('Deverá gerar e retornar um código único ', async () => {
    const spy = vi.spyOn(inMemoryShortenedUrlRepository, 'findByShortCode');
    const code = await generateUniqueShortCodeService.execute();

    expect(code).toBeDefined();
    expect(code).toHaveLength(6);
    expect(spy).toHaveBeenCalled();
  });
});
