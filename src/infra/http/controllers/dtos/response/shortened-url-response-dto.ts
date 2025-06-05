import { ApiProperty } from '@nestjs/swagger';

export class ShortenedUrlResponseDto {
  @ApiProperty({
    example: 'id_url',
    description: 'ID do registro de URL',
  })
  id: string;

  @ApiProperty({
    example: 'cpauKd',
    description: 'Código encurtado da URL',
  })
  shortCode: string;

  @ApiProperty({
    example: 'http://www.google.com',
    description: 'URL original',
  })
  originalUrl: string;

  @ApiProperty({
    example: 0,
    description: 'Quantidade de cliques na URL encurtada',
  })
  clickCount: number;

  @ApiProperty({
    example: 'id_do_usuário',
    description: 'ID do usuário que criou a URL',
  })
  userId: string;

  @ApiProperty({
    example: '2025-06-05T21:06:50.381Z',
    description: 'Data de criação do registro',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-06-05T21:06:50.381Z',
    description: 'Data da última atualização do registro',
  })
  updatedAt: Date;
}
