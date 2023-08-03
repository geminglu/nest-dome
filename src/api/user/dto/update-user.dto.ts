import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './userDto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {
  // @ApiProperty({
  //   title: '邮箱',
  //   example: 'example@outlook.com',
  //   required: false,
  // })
  // email: string;
}
