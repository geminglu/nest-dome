import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsEmpty,
  IsUUID,
  IsMobilePhone,
  IsOptional,
  IsInt,
  IsNumberString,
  IsPhoneNumber,
  Matches,
  IsByteLength,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @ApiProperty({
    example: '张三',
    title: '用户名',
    maxLength: 10,
    minLength: 2,
    description: '用户姓名在2-10之间',
  })
  @IsByteLength(2, 20, {
    message: (v) => `'${v.property}'长度必须是2-10个字符`,
  })
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ title: '年龄', example: 22 })
  age?: number;

  @IsOptional()
  @ApiPropertyOptional({
    title: '性别',
    example: 1,
    enum: [1, 0],
    description: '1：男；0：女',
  })
  gender?: 0 | 1;

  @ApiProperty({
    title: '邮箱',
    example: 'example@outlook.com',
    required: true,
  })
  @IsNotEmpty({
    message: (v) => `'${v.property}'不能为空`,
    always: true,
  })
  @IsEmail()
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ title: '头像' })
  avatars?: string;

  @IsPhoneNumber('CN')
  @ApiPropertyOptional({ title: '手机号' })
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional({ title: '真实姓名' })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    title: '角色',
    enum: [0, 1],
    description: '0：管理员：1：普通用户',
  })
  role?: 0 | 1;

  @IsOptional()
  @ApiPropertyOptional({ title: '1：启用；0：禁用', enum: [0, 1] })
  isActive?: 0 | 1;
}
