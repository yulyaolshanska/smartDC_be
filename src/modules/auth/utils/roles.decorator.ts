import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
