import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { UserDoesNotExistError } from '../errors/user-not-found-error';
import { ShortenedUrl } from '../entities/shortened-url';

@Injectable()
export class FetchShortenedUrlByIdUseCase {
  constructor(
    private shortenedUrlRepository: IShortenedUrlRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ShortenedUrl[]> {
    const userExist = await this.userRepository.findById(userId);

    if (!userExist) {
      throw new UserDoesNotExistError();
    }

    const shortenedUrl = await this.shortenedUrlRepository.findByUserId(userId);

    return shortenedUrl;
  }
}
