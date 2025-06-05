import { ApiProperty } from '@nestjs/swagger';
import { UserLoginResponseDto } from './user-login-response-dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'meu_token',
    description: 'Token para ser utilizado nas requisições',
  })
  access_token: string;

  @ApiProperty()
  user: UserLoginResponseDto;
}
