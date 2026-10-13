import { PartialType } from '@nestjs/swagger';
import { CreateScimUserDto } from './create-scim-user.dto';

export class UpdateScimDto extends PartialType(CreateScimUserDto) {}
