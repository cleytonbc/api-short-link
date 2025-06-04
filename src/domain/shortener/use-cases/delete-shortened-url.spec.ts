import { InMemoryShortenedUrlRepository } from "@test/repositories/in-memory-shortened-url-repository";
import { DeleteShortenedUrlUseCase } from "./delete-shortened-url";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user-repository";
import { makeUser } from "@test/factories/make-user";
import { makeShortenedUrl } from "@test/factories/make-shortened-url";
import { UrlNotFoundError } from "../errors/url-not-found-error";

describe('DeleteShortenedUrlUseCase', () => {
  let shortenedUrlRepository: InMemoryShortenedUrlRepository;
  let deleteShortenedUrlUseCase: DeleteShortenedUrlUseCase;
  let userRepository: InMemoryUserRepository;
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository();
    userRepository = new InMemoryUserRepository();
    deleteShortenedUrlUseCase = new DeleteShortenedUrlUseCase(
      shortenedUrlRepository,
    );
  });
  it('Deve ser possível deletar uma url encurtada', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const shortenedUrl = makeShortenedUrl({
      userId: user.id,
    });
    
    await shortenedUrlRepository.create(shortenedUrl);

    await deleteShortenedUrlUseCase.execute({
      id: shortenedUrl.id.toValue(),
      userId: user.id.toValue(),
    });

    const shortenedUrlDeleted = await shortenedUrlRepository.findById(shortenedUrl.id.toValue());

    expect(shortenedUrlDeleted).toBeNull();
  });

  it('Deve retornar um erro quando a url não existir', async () => {
    const user = makeUser();
    await userRepository.create(user);

    await expect(deleteShortenedUrlUseCase.execute({
      id: 'any-id',
      userId: user.id.toValue(),
    })).rejects.toThrow(UrlNotFoundError);
  });
  
  it('Deve retornar um erro quando a url não pertencer ao usuário', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const shortenedUrl = makeShortenedUrl({
      userId: user.id,
    }); 

    await shortenedUrlRepository.create(shortenedUrl);

    await expect(deleteShortenedUrlUseCase.execute({
      id: shortenedUrl.id.toValue(),
      userId: 'any-id',
    })).rejects.toThrow(UrlNotFoundError);
  });
});