import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseSchema {
  @Prop({ type: Types.ObjectId, required: true })
  @ApiProperty({ type: String, format: 'ObjectId' })
  _id: Types.ObjectId;
}
