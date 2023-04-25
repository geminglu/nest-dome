import { ApiProperty, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsEmpty,
  IsUUID,
  IsMobilePhone,
  IsOptional,
  IsInt,
  IsNumberString,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class QueryUserDto {
  @ApiProperty({ description: '分页大小', required: false, minimum: 1 })
  pageSize: number;

  @ApiProperty({ description: '页码', required: false, minimum: 1 })
  page: number;

  @IsOptional()
  @ApiProperty({
    enum: [0, 1],
    description: '角色;0：管理员;1：普通用户',
    required: false,
  })
  role: 0 | 1;

  @IsOptional()
  @ApiProperty({
    example: '展例声别口军',
    title: '姓名',
    required: false,
    maxLength: 20,
    minLength: 2,
    description: '用户姓名在2-25之间',
  })
  userName: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ title: '年龄', example: 22, required: false })
  age: number;

  @IsOptional()
  @ApiProperty({
    title: '性别',
    example: 1,
    enum: [1, 0],
    description: '1：男；0：女',
    required: false,
  })
  gender: 0 | 1;

  @IsOptional()
  @ApiProperty({
    description: '邮箱',
    example: 't.sdfcnlwvq@qbbngryr.ke',
    required: false,
  })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsOptional()
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: () => '手机号格式不正确' })
  @ApiProperty({ example: 18125991498, description: '手机号', required: false })
  phone: number;

  @IsOptional()
  @ApiProperty({ example: '顾娜', description: '真实姓名', required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ description: '1：启用；0：禁用', enum: [0, 1], required: false })
  isActive: 0 | 1 | undefined;
}
