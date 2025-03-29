import { PartialType, OmitType, PickType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './userDto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @ApiProperty({
  //   title: '邮箱',
  //   example: 'example@outlook.com',
  //   required: false,
  // })
  // email: string;
  // @IsOptional()
  // @ApiProperty({ title: '密码', required: false })
  // @IsString()
  // password?: string;
}

export class UpdateMyUserDto extends PartialType(OmitType(CreateUserDto, ['isActive', 'role'])) {}

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
