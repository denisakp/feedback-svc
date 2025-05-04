import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksRepository } from './feedbacks.repository';
import { UsersRepository } from '../users';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFeedbackDto, GetFeedbacksDto } from './dto';
import { Types } from 'mongoose';

describe('FeedbacksService', () => {
  let service: FeedbacksService;
  let feedbacksRepository: jest.Mocked<FeedbacksRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbacksService,
        {
          provide: FeedbacksRepository,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeedbacksService>(FeedbacksService);
    feedbacksRepository = module.get(FeedbacksRepository);
    usersRepository = module.get(UsersRepository);

    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeedback', () => {
    it('should create feedback if user exists', async () => {
      const payload: CreateFeedbackDto = {
        recipientUserId: new Types.ObjectId().toHexString(),
        message: 'Great job!',
      };
      const mockUser = { _id: new Types.ObjectId(payload.recipientUserId) };
      const mockFeedback = { ...payload, _id: new Types.ObjectId() };

      usersRepository.findOne.mockResolvedValue(mockUser as any);
      feedbacksRepository.save.mockResolvedValue(mockFeedback as any);

      const result = await service.createFeedback(payload);

      expect(result).toEqual(mockFeedback);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        _id: new Types.ObjectId(payload.recipientUserId),
      });
      expect(feedbacksRepository.save).toHaveBeenCalledWith({
        recipientUserId: mockUser._id,
        message: payload.message,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const payload: CreateFeedbackDto = {
        recipientUserId: new Types.ObjectId().toHexString(),
        message: 'Great job!',
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.createFeedback(payload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const payload: CreateFeedbackDto = {
        recipientUserId: new Types.ObjectId().toHexString(),
        message: 'Great job!',
      };
      const mockUser = { _id: new Types.ObjectId(payload.recipientUserId) };

      usersRepository.findOne.mockResolvedValue(mockUser as any);
      feedbacksRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createFeedback(payload)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getMyFeedbacks', () => {
    it('should return feedbacks for a user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const query: GetFeedbacksDto = { page: 1, limit: 10 };
      const mockFeedbacks = {
        items: [{ message: 'Great job!' }],
        total: 1,
        pages: 1,
        current: 1,
      };

      feedbacksRepository.find.mockResolvedValue(mockFeedbacks as any);

      const result = await service.getMyFeedbacks(userId, query);

      expect(result).toEqual(mockFeedbacks);
      expect(feedbacksRepository.find).toHaveBeenCalledWith(
        { recipientUserId: new Types.ObjectId(userId) },
        query.page,
        query.limit,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      const userId = new Types.ObjectId().toHexString();
      const query: GetFeedbacksDto = { page: 1, limit: 10 };

      feedbacksRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getMyFeedbacks(userId, query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
