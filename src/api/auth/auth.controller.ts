import { Controller, Post, Get, Body, Req, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import * as UAParser from 'ua-parser-js';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../decorators/public.decorator';
import { AuthService } from './auth.service';
import {
  LoginDto,
  CreateTokenDto,
  RegisterUserDto,
  CaptchaDto,
  CaptchaResultDto,
  AccessTokenDto,
  RefreshTokenDto,
  GeneEmailCodeDto,
  verifyEmailCodeDto,
} from './dto/auth.dto';
import { ResSuccess, ResServerErrorResponse } from 'src/utils/api.Response';
import { ResultData } from 'src/utils/result';
import { GraphicCodeNetities } from 'src/entities/graphicCode.netities';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
@ApiExtraModels(CaptchaResultDto, CreateTokenDto)
@ResServerErrorResponse()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(GraphicCodeNetities)
    private readonly GraphicCodeRepository: Repository<GraphicCodeNetities>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @ApiOperation({
    summary: '用户登陆',
    description: '使用邮箱/用户名/手机号登录',
  })
  @Post('login')
  @ResSuccess(CreateTokenDto)
  @Public()
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
  @Public()
  register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @Post('refreshToekn')
  @ApiOperation({
    summary: '刷新token',
  })
  @ResSuccess(CreateTokenDto)
  @Public()
  refreshToekn(@Body() token: RefreshTokenDto) {
    return this.authService.refreshToken(token);
  }

  @Get('getPublicKey')
  @ApiOperation({
    summary: '获取公钥',
    description: '使用这个公钥对数据加密',
  })
  @ResSuccess(String)
  @Public()
  getPublicKey() {
    return this.authService.getPublicKey();
  }

  @Post('getCaptcha')
  @ApiOperation({
    summary: '获取图形验证码',
    description: '生成4位图形验证码',
  })
  @ResSuccess(CaptchaResultDto)
  @Public()
  getCaptcha(@Body() Body: CaptchaDto) {
    return this.authService.genderCaptcha(Body);
  }

  @Post('verifyToekn')
  @ApiOperation({
    summary: '验证accessToken是否有效',
  })
  @HttpCode(200)
  @ResSuccess(Boolean)
  @Public()
  async verifyToekn(@Body() token: AccessTokenDto) {
    return ResultData.ok(await this.authService.verifyToekn(token.access_token));
  }

  @Post('generateEmailCode')
  @ApiOperation({
    summary: '获取邮箱验证码',
  })
  @HttpCode(200)
  @ResSuccess(String)
  @Public()
  async generateEmailCode(@Body() body: GeneEmailCodeDto) {
    // 生成随机数
    const randomStr = Math.random().toString(36).slice(-4);

    await this.authService.senEmailCode(body.email, randomStr);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const graphicCode = new GraphicCodeNetities();
      graphicCode.code = randomStr;
      const graphic = await queryRunner.manager.save<GraphicCodeNetities>(graphicCode);
      await queryRunner.commitTransaction();
      return ResultData.ok(graphic.id, '发送成功请在邮箱中查看');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  @Post('verifyEmailCode')
  @ApiOperation({
    summary: '验证邮箱验证码',
    description: '验证邮箱验证码验证通过后返回 JWT_token',
  })
  @HttpCode(200)
  @ResSuccess(String)
  async verifyEmailCode(@Req() req, @Body() body: verifyEmailCodeDto) {
    // 验证邮箱验证码
    try {
      await this.authService.verifyCode(body.verifyCode, body.codeId);
    } catch (error) {
      return ResultData.fail(error.message || '验证失败');
    }

    const jwt = await this.jwtService.signAsync(
      { type: body.type, uid: req.user.id },
      {
        expiresIn: this.config.get('config.verifyCodeExpirationTime'),
      },
    );

    return ResultData.ok(jwt, '验证成功');
  }
}
