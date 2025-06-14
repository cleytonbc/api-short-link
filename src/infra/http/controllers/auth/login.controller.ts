import { User } from '@/domain/users/entities/user';
import { AuthService } from '@/infra/auth/auth.service';
import { AuthResponseDTO } from '@/infra/auth/dtos/auth-response.dto';
import { LoginDto } from '@/infra/auth/dtos/login.dto';

import { LocalAuthGuard } from '@/infra/auth/guards/local-auth.guard';

import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as RequestType } from 'express';
import { LoginPresenter } from '../../presenters/login.presenter';
import { ApiOperation } from '@nestjs/swagger';
import { SWAGGER_API_TAGS } from '@/infra/swagger/tags';
import { ApiCreateEndpoint } from '@/infra/swagger/api-response-default.decorator';
import { LoginResponseDto } from '../dtos/response/login-response-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Efetuar login',
    tags: [SWAGGER_API_TAGS.AUTH],
  })
  @ApiCreateEndpoint<LoginResponseDto>(LoginResponseDto)
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: RequestType,
  ): Promise<AuthResponseDTO> {
    const user: User = req.user as User;

    const response = await this.authService.login(user);

    return LoginPresenter.toHTTP(response);
  }
}
