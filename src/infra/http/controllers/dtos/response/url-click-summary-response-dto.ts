import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDTO } from './pagination-response-dto';

export class ClickSummaryResponseDto {
  @ApiProperty({
    example: 'e6d47e76fe208443d73fa2f6ab384ac2',
    description: 'ID do resumo de cliques',
  })
  id: string;

  @ApiProperty({
    example: '5e8f8ca6-a41d-4fed-95ef-7adc478aaa00',
    description: 'ID do usuário que criou a URL',
  })
  userId: string;

  @ApiProperty({
    example: '18a37a3e-71f5-4788-b013-46b1f9d06d3f',
    description: 'ID da URL encurtada',
  })
  shortenedUrlId: string;

  @ApiProperty({
    example: 'NvUS0_',
    description: 'Código encurtado da URL',
  })
  shortCode: string;

  @ApiProperty({
    example: 'http://www.google.com',
    description: 'URL original',
  })
  originalUrl: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'E-mail do usuário',
  })
  userEmail: string;

  @ApiProperty({
    example: 'Cleyton',
    description: 'Nome do usuário',
  })
  userName: string;

  @ApiProperty({
    example: '2025-06-08T00:00:00.000Z',
    description: 'Data do clique (por dia)',
  })
  clickDate: Date;

  @ApiProperty({
    example: 13,
    description: 'Hora do clique (0 a 23)',
  })
  clickHour: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade de cliques nesse intervalo',
  })
  clickCount: number;

  @ApiProperty({
    example: '2025-06-04T14:11:47.314Z',
    description: 'Data de criação da url encurtada',
  })
  createdAt: Date;
}

export class PaginatedClickSummaryResponseResponseDTO {
  @ApiProperty({ type: PaginationResponseDTO })
  pagination!: PaginationResponseDTO;

  @ApiProperty({ type: [ClickSummaryResponseDto] })
  data!: ClickSummaryResponseDto[];
}
