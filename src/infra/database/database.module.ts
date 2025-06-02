import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { IUserRepository } from '@/domain/users/repositories/user-repository.interface';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, IUserRepository],
})
export class DatabaseModule {}
