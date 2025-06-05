import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponseDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'Cleyton', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'cleyton@email.com',
    description: 'E-mail do usuário',
  })
  email: string;
}
