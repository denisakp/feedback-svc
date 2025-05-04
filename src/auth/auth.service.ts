import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRegisterDto, UsersService } from '../users';
import { comparePassword, hashPassword } from './auth.utils';
import { AuthenticatedUser } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);

    if (isValid) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    return null;
  }

  /**
   * Login user
   * @param payload
   */
  async login(payload: any) {
    const { user } = payload;
    const data: AuthenticatedUser = {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
    };

    return { access_token: this.jwtService.sign(data) };
  }

  /**
   * Register user
   * @param payload
   */
  async register(payload: UserRegisterDto) {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (existingUser)
      throw new UnprocessableEntityException(
        `User email ${payload.email} already exists`,
      );

    const user = await this.userService.register({
      ...payload,
      password: await hashPassword(payload.password),
    });

    const jwtPayload: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return { access_token: this.jwtService.sign(jwtPayload) };
  }
}
