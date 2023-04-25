import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = '1',
  Admin = '0',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
