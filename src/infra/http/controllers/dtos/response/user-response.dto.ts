import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'I do usuário' })
  id: number;

  @ApiProperty({ example: 'Cleyton', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'cleyton@email.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    example: '2025-05-17T18:49:16.519Z',
    description: 'Data da última autenticação do usuário',
    nullable: true,
  })
  lastLoginAt: Date;

  @ApiProperty({
    example: '2025-05-17T18:49:16.519Z',
    description: 'Data da criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '025-05-17T18:49:16.519Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}
