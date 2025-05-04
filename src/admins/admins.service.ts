import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { FeedbacksRepository } from '../feedbacks';
import { UsersRepository } from '../users';

@Injectable()
export class AdminsService {
  private readonly logger: Logger = new Logger(AdminsService.name);

  constructor(
    private readonly feedbackRepository: FeedbacksRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Counts the number of feedbacks in the database.
   * @returns {Promise<number>} The total number of feedbacks.
   * @throws {InternalServerErrorException} If an error occurs while counting feedbacks.
   */
  async countFeedbacks(): Promise<{ count: number }> {
    try {
      const count = await this.feedbackRepository.count();
      return { count };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Counts the number of active users in the database.
   * @returns {Promise<number>} The total number of active users.
   * @throws {InternalServerErrorException} If an error occurs while counting active users.
   */
  async countActiveUsers(): Promise<{ count: number }> {
    try {
      const count = await this.usersRepository.count({});
      return { count };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
