import { ApiProperty, PickType, ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { CreateUserDto } from 'src/api/user/dto/userDto';

export enum verifyType {
  UPEMAIL = 'UPEMAIL',
}

export class LoginDto {
  @ApiProperty({ description: '邮箱/用户名/手机号' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly account: string;

  @ApiProperty({ description: '密码' })
  @IsString({ message: 'password 类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({ description: '验证码id' })
  @IsNotEmpty({ message: '验证码id不能为空' })
  captchaId: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captchaCode: string;
}

export class RegisterUserDto extends PickType(CreateUserDto, ['email', 'name']) {
  @ApiProperty({ title: '密码', required: true })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  password: string;

  @ApiProperty({ title: '邮箱验证码', required: true })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  verifyCode: string;

  @ApiProperty({ title: '验证码ID', required: true })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  codeId: string;
}

export class CreateTokenDto {
  @ApiProperty({ title: 'access_token', required: true })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  access_token: string;

  @ApiProperty({ title: 'refresh_token', required: true })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  refresh_token: string;
}

export class RefreshTokenDto extends PickType(CreateTokenDto, ['refresh_token']) {}

export class AccessTokenDto extends PickType(CreateTokenDto, ['access_token']) {}

export class PayloadTokenDto {
  username: string;
  id: string;
}

/**
 * 获取验证码的DTO
 */
export class CaptchaDto {
  @ApiPropertyOptional()
  @ApiProperty({ description: '宽度(px)' })
  width: number;

  @ApiPropertyOptional()
  @ApiProperty({ description: '高度(px)' })
  height: number;
}

/**
 * 获取验证码结果的DTO
 */

@ApiExtraModels()
export class CaptchaResultDto {
  @ApiPropertyOptional()
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiPropertyOptional()
  @ApiProperty({ description: 'code' })
  code: string;
}

export class GeneEmailCodeDto {
  @ApiProperty({ title: '邮箱', required: true })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  email: string;
}

export class verifyEmailCodeDto {
  @ApiProperty({ title: '邮箱验证码', required: true })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  verifyCode: string;

  @ApiProperty({ title: '验证码ID', required: true })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  codeId: string;

  @ApiProperty({ title: '业务类型', required: true, enum: verifyType })
  @IsString()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  type: verifyType;
}
