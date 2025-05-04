import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Feedback, FeedbackDocument } from './feedbacks.schema';
import { PaginationResponseDTO } from 'src/database';

@Injectable()
export class FeedbacksRepository {
  constructor(
    @InjectModel(Feedback.name) private readonly model: Model<FeedbackDocument>,
  ) {}

  async save(payload: Partial<Feedback>): Promise<Feedback> {
    const document = new this.model({
      _id: new Types.ObjectId(),
      ...payload,
    });

    return document.save();
  }

  async count(query: FilterQuery<FeedbackDocument> = {}): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async find(
    query: FilterQuery<FeedbackDocument>,
    page: number,
    limit: number,
  ) {
    const skip = limit * (page - 1);

    const items = await this.model
      .find(query)
      .select('-recipientUserId')
      .skip(skip)
      .limit(limit);

    const total = await this.model.find(query).countDocuments();
    const pages = total > 0 ? Math.ceil(total / limit) : 0;

    return new PaginationResponseDTO<Feedback>({
      items,
      total,
      pages,
      current: page,
    });
  }
}
