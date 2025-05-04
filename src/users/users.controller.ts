import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto';
import { JwtGuard } from '../auth/guards';

@Controller('users')
@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiProduces('application/json')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  updatePassword(@Body() dto: ChangePasswordDto) {
    return this.usersService.updatePassword('', dto);
  }
}
