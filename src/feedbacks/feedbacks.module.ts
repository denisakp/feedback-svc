import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Feedback, FeedbackSchema } from './feedbacks.schema';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksRepository } from './feedbacks.repository';
import { UsersModule } from '../users';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService, FeedbacksRepository],
  exports: [FeedbacksRepository, FeedbacksService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
})
export class FeedbacksModule {}
