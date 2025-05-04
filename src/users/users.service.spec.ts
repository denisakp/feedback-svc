import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRegisterDto, ChangePasswordDto } from './dto';
import { RoleEnum } from './users.schema';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            updateOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);

    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const mockUser = { email: 'test@example.com' };
      repository.findByEmail.mockResolvedValue(mockUser as any);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user is not found', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('test@example.com');
      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('register', () => {
    it('should save a new user if email is not taken', async () => {
      const payload: UserRegisterDto = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
      };
      const mockUser = { ...payload, role: RoleEnum.USER };
      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockResolvedValue(mockUser as any);

      const result = await service.register(payload);
      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith(payload.email);
      expect(repository.save).toHaveBeenCalledWith({
        ...payload,
        role: RoleEnum.USER,
      });
    });

    it('should throw UnprocessableEntityException if email is already taken', async () => {
      const payload: UserRegisterDto = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
      };
      repository.findByEmail.mockResolvedValue({ email: payload.email } as any);

      await expect(service.register(payload)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updatePassword', () => {
    it('should update the password if old password matches', async () => {
      const email = 'test@example.com';
      const payload: ChangePasswordDto = {
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      };
      const mockUser = { _id: '123', email, password: 'oldPass' };
      repository.findByEmail.mockResolvedValue(mockUser as any);
      repository.updateOne.mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPass',
      } as any);

      await service.updatePassword(email, payload);
      expect(repository.findByEmail).toHaveBeenCalledWith(email);
      expect(repository.updateOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { password: expect.any(String) },
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      repository.findByEmail.mockResolvedValue(null);

      await expect(
        service.updatePassword('test@example.com', {
          oldPassword: 'old',
          newPassword: 'new',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if old password does not match', async () => {
      const email = 'test@example.com';
      const payload: ChangePasswordDto = {
        oldPassword: 'wrongPass',
        newPassword: 'newPass',
      };
      const mockUser = { _id: '123', email, password: 'oldPass' };
      repository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.updatePassword(email, payload)).rejects.toThrow(
        'Password is incorrect',
      );
    });
  });
});
