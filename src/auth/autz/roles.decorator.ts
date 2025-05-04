import { RoleEnum } from '../../users';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const HasRole = (role: RoleEnum) => SetMetadata(ROLES_KEY, role);
