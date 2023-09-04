import { PartialType, OmitType, PickType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './userDto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {
  // @ApiProperty({
  //   title: '邮箱',
  //   example: 'example@outlook.com',
  //   required: false,
  // })
  // email: string;
}

export class UpdateMyUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'isActive', 'role']),
) {}

export class UpdateMyEmailDto extends PickType(CreateUserDto, ['email']) {
  @ApiProperty({
    title: '验证通过后的 token',
    required: true,
  })
  @IsNotEmpty({
    message: (v) => `'${v.property}'不能为空`,
  })
  token: string;
}
