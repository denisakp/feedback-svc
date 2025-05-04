import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { FeedbacksRepository } from './feedbacks.repository';
import { CreateFeedbackDto, GetFeedbacksDto } from './dto';
import { UsersRepository } from '../users';

@Injectable()
export class FeedbacksService {
  private readonly logger: Logger = new Logger(FeedbacksService.name);

  constructor(
    private readonly repository: FeedbacksRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Create feedback
   * @returns Created feedback
   * @throws InternalServerErrorException - Failed to create feedback
   * @param payload - CreateFeedbackDto
   */
  async createFeedback(payload: CreateFeedbackDto) {
    const user = await this.usersRepository.findOne({
      _id: new Types.ObjectId(payload.recipientUserId),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      return await this.repository.save({
        recipientUserId: user._id,
        message: payload.message,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get feedbacks for a user
   * @param userId - User id
   * @param query - GetFeedbacksDto
   * @returns List of feedbacks
   * @throws InternalServerErrorException - Failed to get feedbacks
   */
  async getMyFeedbacks(userId: string, query: GetFeedbacksDto) {
    try {
      return await this.repository.find(
        { recipientUserId: new Types.ObjectId(userId) },
        query.page,
        query.limit,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
