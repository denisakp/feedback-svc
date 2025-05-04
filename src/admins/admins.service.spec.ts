import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { FeedbacksRepository } from '../feedbacks';
import { UsersRepository } from '../users';
import { InternalServerErrorException } from '@nestjs/common';

describe('AdminsService', () => {
  let service: AdminsService;
  let feedbacksRepository: jest.Mocked<FeedbacksRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        {
          provide: FeedbacksRepository,
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
    feedbacksRepository = module.get(FeedbacksRepository);
    usersRepository = module.get(UsersRepository);

    // mock the logger to suppress console errors
    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('countFeedbacks', () => {
    it('should return the count of feedbacks', async () => {
      feedbacksRepository.count.mockResolvedValue(10);

      const result = await service.countFeedbacks();
      expect(result).toEqual({ count: 10 });
      expect(feedbacksRepository.count).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      feedbacksRepository.count.mockRejectedValue(new Error('Database error'));

      await expect(service.countFeedbacks()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('countActiveUsers', () => {
    it('should return the count of active users', async () => {
      usersRepository.count.mockResolvedValue(5);

      const result = await service.countActiveUsers();
      expect(result).toEqual({ count: 5 });
      expect(usersRepository.count).toHaveBeenCalledWith({});
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      usersRepository.count.mockRejectedValue(new Error('Database error'));

      await expect(service.countActiveUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
