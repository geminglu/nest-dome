import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsMobilePhone, IsOptional, Length, IsString } from 'class-validator';
import { UserRole, Gender, Active } from 'src/types/user';

export class CreateUserDto {
  @ApiProperty({
    example: '张三',
    title: '用户名',
    minLength: 2,
  })
  @Length(2, 25, {
    message: (v) => `'${v.property}'长度必须是2-10个字符`,
  })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    title: '性别',
    example: 1,
    enum: Gender,
    description: '1：男；0：女',
  })
  gender?: Gender | null;

  @ApiProperty({
    title: '邮箱',
    example: 'example@outlook.com',
    required: true,
  })
  @IsNotEmpty({
    message: (v) => `'${v.property}'不能为空`,
    always: true,
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ title: '头像' })
  avatars?: string;

  @IsOptional()
  @IsMobilePhone('zh-CN')
  @ApiPropertyOptional({ title: '手机号' })
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional({
    title: '角色',
    enum: UserRole,
    description: '0：管理员：1：普通用户',
  })
  role?: UserRole;

  @IsOptional()
  @ApiPropertyOptional({ title: '1：启用；0：禁用', enum: Active })
  isActive?: Active;

  @ApiProperty({ title: '密码', required: true })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  password: string;
}

export class UserInfo extends OmitType(CreateUserDto, ['password']) {
  @ApiProperty({ title: '创建时间' })
  createAt: Date;

  @ApiProperty({ title: '1：启用；0：禁用', enum: Active })
  isActive?: Active;

  @ApiProperty()
  id: string;
}
