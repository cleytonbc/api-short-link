import { CreateUserUseCase } from '@/domain/users/use-cases/create-user';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserRequesDto } from '../dtos/request/create-user-request-dto';
import { UserPresenter } from '../../presenters/user.presenter';
import { ApiOperation } from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiCreateEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { UserResponseDto } from '../dtos/response/user-response.dto';

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar um novo usuário',
    tags: [SWAGGER_API_TAGS.USERS],
  })
  @ApiCreateEndpoint<UserResponseDto>(UserResponseDto)
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
