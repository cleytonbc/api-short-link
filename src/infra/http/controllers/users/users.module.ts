import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { CreateUserUseCase } from '@/domain/users/use-cases/create-user';

@Module({
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
