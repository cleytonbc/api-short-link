import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { makeUser } from '@test/factories/make-user';
import { UserDoesNotExistError } from '../errors/user-not-found-error';
import { InMemoryVwUrlClicksSummaryRepository } from '@test/repositories/in-memory-url-click-summray-repository';
import { FetchUrlClicksSummaryByUserUseCase } from './fetch-url-click-summary';
import { makeVwUrlClicksSummary } from '@test/factories/make-url-click-summary';

describe('FetchUrlClicksSummaryByUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let vwUrlClicksSummaryRepository: InMemoryVwUrlClicksSummaryRepository;
  let fetchUrlClicksSummaryByUser: FetchUrlClicksSummaryByUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    vwUrlClicksSummaryRepository = new InMemoryVwUrlClicksSummaryRepository();
    fetchUrlClicksSummaryByUser = new FetchUrlClicksSummaryByUserUseCase(
      vwUrlClicksSummaryRepository,
      userRepository,
    );
  });

  it('Deve retornar o resumo de cliques das URLs do usuário', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const summary1 = makeVwUrlClicksSummary({ userId: user.id.toValue() });
    const summary2 = makeVwUrlClicksSummary({ userId: user.id.toValue() });
    const summaryOtherUser = makeVwUrlClicksSummary();

    await vwUrlClicksSummaryRepository.create(summary1);
    await vwUrlClicksSummaryRepository.create(summary2);
    await vwUrlClicksSummaryRepository.create(summaryOtherUser);

    const result = await fetchUrlClicksSummaryByUser.execute({
      userId: user.id.toValue(),
    });

    expect(result.vwUrlClicksSummaries).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  it('Deve lançar erro se o usuário não existir', async () => {
    await expect(
      fetchUrlClicksSummaryByUser.execute({
        userId: 'non-existent-id',
      }),
    ).rejects.toThrow(UserDoesNotExistError);
  });
});
