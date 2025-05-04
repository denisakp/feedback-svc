import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async save(payload: Partial<User>): Promise<User> {
    const document = new this.model({ _id: new Types.ObjectId(), ...payload });
    return document.save();
  }

  async findOne(q: FilterQuery<User>): Promise<User> {
    return this.model.findOne(q).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email }).select('+password').exec();
  }

  async updateOne(
    query: FilterQuery<User>,
    payload: Partial<User>,
  ): Promise<User> {
    return this.model
      .findOneAndUpdate(query, { $set: payload }, { new: true })
      .exec();
  }

  async count(query: FilterQuery<UserDocument> = {}): Promise<number> {
    return this.model.countDocuments(query).exec();
  }
}
