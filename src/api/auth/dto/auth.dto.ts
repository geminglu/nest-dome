import { ApiProperty, PickType, ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/api/user/dto/userDto';

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
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  password: string;
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
