import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminsService } from './admins.service';
import { JwtGuard } from '../auth/guards';
import { RoleEnum } from '../users';
import { HasRole } from '../auth/autz/roles.decorator';
import { RolesGuard } from '../auth/autz/roles.guard';

@Controller('admins')
@UseGuards(JwtGuard, RolesGuard)
@HasRole(RoleEnum.ADMIN)
@ApiTags('Admins')
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('count-feedbacks')
  @ApiOperation({ summary: 'Count feedbacks' })
  @ApiResponse({ status: 200, description: 'Success', type: Number })
  countFeedbacks() {
    return this.adminsService.countFeedbacks();
  }

  @Get('count-active-users')
  @ApiOperation({ summary: 'Count active users' })
  @ApiResponse({ status: 200, description: 'Success', type: Number })
  countActiveUsers() {
    return this.adminsService.countActiveUsers();
  }
}
