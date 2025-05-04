import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { JwtService } from '@nestjs/jwt';
import { UnprocessableEntityException } from '@nestjs/common';

jest.mock('./auth.utils', () => ({
  ...jest.requireActual('./auth.utils'),
  hashPassword: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@example.com',
        password: 'hashed',
        name: 'Test',
        role: 'user',
      };
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest
        .spyOn(require('./auth.utils'), 'comparePassword')
        .mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
      });
    });

    it('should return null if user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@example.com',
        password: 'hashed',
      };
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest
        .spyOn(require('./auth.utils'), 'comparePassword')
        .mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
      };
      jwtService.sign.mockReturnValue('mockToken');

      const result = await service.login({ user: mockUser });
      expect(result).toEqual({ access_token: 'mockToken' });
      expect(jwtService.sign).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should register a new user and return a JWT token', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
      };
      const mockUser = {
        _id: '1',
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
      };
      usersService.findByEmail.mockResolvedValue(null);
      usersService.register.mockResolvedValue(mockUser as any);
      jest
        .spyOn(require('./auth.utils'), 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jwtService.sign.mockReturnValue('mockToken');

      const result = await service.register(payload);
      expect(result).toEqual({ access_token: 'mockToken' });
      expect(usersService.findByEmail).toHaveBeenCalledWith(payload.email);
      expect(usersService.register).toHaveBeenCalledWith({
        ...payload,
        password: 'hashedPassword',
      });
    });

    it('should throw UnprocessableEntityException if email already exists', async () => {
      const payload = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
      };
      const mockUser = { _id: '1', email: 'test@example.com' };
      usersService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.register(payload)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(payload.email);
    });
  });
});
