import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import * as UAParser from 'ua-parser-js';
import { Public } from '../../decorators/public.decorator';
import { AuthService } from './auth.service';
import {
  LoginDto,
  CreateTokenDto,
  RegisterUserDto,
  CaptchaDto,
  CaptchaResultDto,
} from './dto/auth.dto';
import { ResSuccess, ResServerErrorResponse } from 'src/utils/api.Response';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
@ApiExtraModels(CaptchaResultDto)
@Public()
@ResServerErrorResponse()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '用户登陆',
    description: '使用邮箱/用户名/手机号登录',
  })
  @Post('login')
  @ResSuccess(CreateTokenDto)
  async login(@Body() body: LoginDto, @Req() request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'] as string;
    const remoteAddress = request.socket.remoteAddress;
    const ip = forwardedFor ? forwardedFor.split(',')[0] : remoteAddress.split(':').pop();
    const userAgent = request.headers['user-agent'];
    const parser = new UAParser();
    const deviceInfo = JSON.stringify(parser.setUA(userAgent).getResult());
    return this.authService.signIn(body, { ip, deviceInfo });
  }

  @Post('register')
  @ApiOperation({
    summary: '注册账号',
    description: '通过邮箱注册',
  })
  @ResSuccess(CreateTokenDto)
  register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @Post('refreshToekn')
  @ApiOperation({
    summary: '刷新token',
  })
  @ResSuccess(CreateTokenDto)
  refreshToekn(@Body() token: CreateTokenDto) {
    return this.authService.refreshToken(token);
  }

  @Get('getPublicKey')
  @ApiOperation({
    summary: '获取公钥',
    description: '使用这个公钥对数据加密',
  })
  @ResSuccess(String)
  getPublicKey() {
    return this.authService.getPublicKey();
  }

  @Post('getCaptcha')
  @ApiOperation({
    summary: '获取图形验证码',
    description: '生成4位图形验证码',
  })
  @ResSuccess(CaptchaResultDto)
  getCaptcha(@Body() Body: CaptchaDto) {
    return this.authService.genderCaptcha(Body);
  }
}
