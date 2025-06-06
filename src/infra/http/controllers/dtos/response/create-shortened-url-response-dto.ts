import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenedUrlResponseDto {
  @ApiProperty({
    example: 'encurtada.com/codigo',
    description: 'Endereço da URL encurtada',
  })
  url: string;
}
