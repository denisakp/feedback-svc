import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'ObjectId' })
  recipientUserId: string;
}
