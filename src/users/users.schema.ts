import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '../database';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  @ApiProperty({ type: String, format: 'email' })
  email: string;

  @Prop({ required: true, select: false })
  @ApiProperty({ writeOnly: true })
  password: string;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.USER })
  @ApiProperty({ enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
