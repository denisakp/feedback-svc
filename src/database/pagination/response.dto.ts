import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDTO<T> {
  @ApiProperty({ type: [Object], isArray: true })
  items: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  current: number;

  constructor(partial: Partial<PaginationResponseDTO<T>>) {
    Object.assign(this, partial);
  }
}
