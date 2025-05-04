import { Module } from '@nestjs/common';

import { DatabaseModule } from './database';
import { FeedbacksModule } from './feedbacks';
import { UsersModule } from './users';
import { AdminsModule } from './admins';
import { AuthModule } from './auth';

@Module({
  imports: [
    DatabaseModule,
    FeedbacksModule,
    UsersModule,
    AdminsModule,
    AuthModule,
  ],
})
export class AppModule {}
