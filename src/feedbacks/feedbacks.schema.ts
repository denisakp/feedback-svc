import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { BaseSchema } from '../database';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ collection: 'feedbacks', timestamps: true, versionKey: false })
export class Feedback extends BaseSchema {
  @Prop()
  @ApiProperty()
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  @ApiProperty({ type: String, format: 'ObjectId' })
  recipientUserId: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
