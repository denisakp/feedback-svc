import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { FeedbacksModule } from '../feedbacks';
import { UsersModule } from '../users';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService],
  imports: [FeedbacksModule, UsersModule],
})
export class AdminsModule {}
