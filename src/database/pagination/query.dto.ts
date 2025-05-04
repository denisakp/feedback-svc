import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  @ApiPropertyOptional()
  page?: number;

  @IsNotEmpty()
  @Min(1)
  @IsInt()
  @ApiPropertyOptional()
  limit?: number;
}
