import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserRegisterDto } from '../users';
import { JwtGuard, LocalGuard } from './guards';

@Controller('auth')
@ApiTags('Auth')
@ApiProduces('application/json')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  signIn(@Request() req: any) {
    return this.authService.login(req);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 422, description: 'User already exists' })
  register(@Body() payload: UserRegisterDto) {
    return this.authService.register(payload);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Success' })
  logout(@Request() req: any) {
    return req.logout();
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
