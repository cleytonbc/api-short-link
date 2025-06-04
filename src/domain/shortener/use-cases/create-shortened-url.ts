import { Injectable } from '@nestjs/common';
import { IShortenedUrlRepository } from '../repositories/shortened-url-repository.interface';
import { CreateShortenedUrlDTO } from '../dtos/create-shortened-url-dto';
import { ShortenedUrl } from '../entities/shortened-url';
import { GenerateUniqueShortCodeService } from '../services/generate-unique-short-code.service';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { UserDoesNotExistError } from '../errors/user-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@Injectable()
export class CreateShortenedUrlUseCase {
  constructor(
    private shortenedUrlRepository: IShortenedUrlRepository,
    private generateUniqueShortCode: GenerateUniqueShortCodeService,
    private userRepository: IUserRepository,
  ) {}

  async execute({
    originalUrl,
    userId,
  }: CreateShortenedUrlDTO): Promise<ShortenedUrl> {
    const shortCode = await this.generateUniqueShortCode.execute();

    if (userId) {
      const userExist = await this.userRepository.findById(userId);
      if (!userExist) {
        throw new UserDoesNotExistError();
      }
    }

    const shortenedUrl = ShortenedUrl.create({
      originalUrl,
      shortCode,
      userId: userId ? new UniqueEntityID(userId) : undefined,
    });

    await this.shortenedUrlRepository.create(shortenedUrl);

    return shortenedUrl;
  }
}
