import { CreateUserUseCase } from '@/domain/users/use-cases/create-user';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserRequesDto } from './dtos/create-user-request';
import { UserPresenter } from '../../presenters/user.presenter';

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateUserRequesDto) {
    const { email, name, password } = body;

    const result = await this.createUserUseCase.execute({
      email,
      name,
      password,
    });

    return UserPresenter.toHTTP(result);
  }
}
