import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto, GetFeedbacksDto } from './dto';
import { JwtGuard } from '../auth/guards';

@Controller('feedbacks')
@ApiTags('Feedbacks')
@ApiProduces('application/json')
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.createFeedback(createFeedbackDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feedbacks' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: GetFeedbacksDto, @Request() req: any) {
    return this.feedbacksService.getMyFeedbacks(req.user.id, query);
  }
}
