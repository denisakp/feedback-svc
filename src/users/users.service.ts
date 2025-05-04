import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { UsersRepository } from './users.repository';
import { ChangePasswordDto, UserRegisterDto } from './dto';
import { hashPassword } from '../auth/auth.utils';
import { RoleEnum } from './users.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repository: UsersRepository) {}

  /**
   * Find user by email
   * @param email - User email
   * @returns User
   * @throws NotFoundException - User not found
   * @throws InternalServerErrorException - Internal server error
   */
  async findByEmail(email: string) {
    try {
      return await this.repository.findByEmail(email);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find user by id
   * @param id - User id
   * @returns User
   * @throws NotFoundException - User not found
   * @throws InternalServerErrorException - Internal server error
   */
  async findById(id: string) {
    const user = await this.repository.findOne({ _id: new Types.ObjectId(id) });

    if (!user) throw new NotFoundException('User not found');

    try {
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Register user
   * @param payload - UserRegisterDto
   * @returns User
   * @throws UnprocessableEntityException - User already exists
   * @throws InternalServerErrorException - Internal server error
   */
  async register(payload: UserRegisterDto) {
    const user = await this.repository.findByEmail(payload.email);

    if (user)
      throw new UnprocessableEntityException(
        `User with email: ${payload.email} already exists`,
      );

    try {
      return this.repository.save({
        ...payload,
        role: RoleEnum.USER,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Update user password
   * @param email - User email
   * @param payload - ChangePasswordDto
   */
  async updatePassword(
    email: string,
    payload: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.repository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    if (user.password !== payload.oldPassword)
      throw new BadRequestException('Password is incorrect');

    const hashedPassword = await hashPassword(payload.newPassword);

    try {
      await this.repository.updateOne(
        { _id: user._id },
        { password: hashedPassword },
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
