import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDTO {
  @ApiProperty({
    example: 115,
    description: 'Total de registro encontrado no banco',
  })
  total!: number;

  @ApiProperty({
    example: 3,
    description: 'Total de paginas disponíveis para esses registros',
  })
  totalPages!: number;

  @ApiProperty({
    example: 1,
    description: 'Página atual',
  })
  currentPage!: number;
}
