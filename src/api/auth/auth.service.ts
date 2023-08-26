import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { generateKeyPairSync } from 'crypto';
import { DataSource, Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'svg-captcha';
import axios from 'axios';
import { MailerService } from '@nestjs-modules/mailer';
import { createTransport } from 'nodemailer';
import { validPhone, validEmail } from 'src/utils/validate';
import { UserService } from '../user/user.service';
import { ResultData } from 'src/utils/result';
import { UserEntities } from 'src/entities/user.entities';
import { LoginLogNetities } from 'src/entities/loginLog.netities';
import {
  RegisterUserDto,
  PayloadTokenDto,
  CreateTokenDto,
  CaptchaDto,
  LoginDto,
  CaptchaResultDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { Active } from 'src/types/user';
import { GraphicCodeNetities } from 'src/entities/graphicCode.netities';
import NodeRSA = require('node-rsa');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(GraphicCodeNetities)
    private readonly GraphicCodeRepository: Repository<GraphicCodeNetities>,
    @InjectRepository(LoginLogNetities)
    private readonly LoginLogRepository: Repository<LoginLogNetities>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 登陆
   * @param username 账号
   * @param pass 密码
   * @returns
   */
  async signIn(login: LoginDto, device: { ip: string; deviceInfo: string }) {
    /**
     * 1: 验证图形验证码
     * 2: 解密
     * 3：验证账号是否为手机号，如果为手机号就通过手机号查找用户信息
     * 4：如果不是手机号就验证是否为邮箱，如果为邮箱就通过手机号查找用户信息
     * 5：如果账号类型不是邮箱也不是手机号就验证是否为用户名
     * 6：如果都没有匹配到说明该账号不存在
     */

    // 验证图形验证码
    const graphicCode = await this.GraphicCodeRepository.findOne({
      where: {
        id: login.captchaId,
        createAt: MoreThan(
          new Date(new Date().getTime() - Number(process.env.GRAPHIC_EXPIRATION_TIME)),
        ),
      },
    });

    if (
      !graphicCode ||
      graphicCode.code.toLocaleLowerCase() !== login.captchaCode.toLocaleLowerCase()
    ) {
      return ResultData.fail('验证错误');
    }

    // 解密
    const privateKey = new NodeRSA(process.env.PRIVATE_KEY);
    privateKey.setOptions({ encryptionScheme: 'pkcs1' });

    const account = privateKey.decrypt(login.account).toString();
    const password = privateKey.decrypt(login.password).toString();
    let user: UserEntities = null;

    // 验证账号类型
    if (validPhone(account)) {
      user = await this.userService.findPhone(account);
    } else if (validEmail(account)) {
      user = await this.userService.findEmail(account);
    } else {
      user = await this.userService.findUserName(account);
    }

    if (!user) return ResultData.fail('账号不存在');

    // 账号被禁用了就不允许登陆
    if (user.isActive === Active.DISABLE) return ResultData.fail('账号被禁用请联系管理员');

    if (!(await bcrypt.compare(password, user.password))) {
      return ResultData.fail('账号或密码错误');
    }

    const result = await this.generateToken({ username: user.name, id: user.id });
    this.addLoginLog(user.id, device);
    return ResultData.ok(result, '登陆成功');
  }

  /**
   * 创建登陆记录
   */
  async addLoginLog(uid: string, info: { ip: string; deviceInfo: string }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { country, prov, city, district } =
        (await axios.get(`https://qifu-api.baidubce.com/ip/geo/v1/district?ip=139.227.71.130`)).data
          ?.data || {};
      const LoginLog = new LoginLogNetities();
      LoginLog.uid = uid;
      LoginLog.loginIp = info.ip;
      LoginLog.deviceInfo = info.deviceInfo;
      LoginLog.location = `${country}/${prov}/${city}/${district}`;
      await queryRunner.manager.save<LoginLogNetities>(LoginLog);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 注册用户
   */
  async register(registerUser: RegisterUserDto) {
    // 验证邮箱验证码
    const graphicCode = await this.GraphicCodeRepository.findOne({
      where: {
        id: registerUser.codeId,
        createAt: MoreThan(
          new Date(new Date().getTime() - Number(process.env.GRAPHIC_EXPIRATION_TIME)),
        ),
      },
    });

    if (
      !graphicCode ||
      graphicCode.code.toLocaleLowerCase() !== registerUser.verifyCode.toLocaleLowerCase()
    ) {
      return ResultData.fail('验证错误');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const param = {
        password: registerUser.password,
        name: registerUser.name,
        email: registerUser.email,
      };
      const result = await this.userService.create(param, queryRunner);
      if (result) {
        // 注册成功后生成token
        const user = await this.generateToken({ username: result?.name, id: result?.id });
        await queryRunner.commitTransaction();
        return ResultData.ok(user, '注册成功');
      } else {
        await queryRunner.rollbackTransaction();
        ResultData.fail('注册失败');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 生成token和refreshToken
   * @param payload
   * @returns
   */
  async generateToken(payload: PayloadTokenDto): Promise<CreateTokenDto> {
    return {
      access_token: await this.jwtService.signAsync({ ...payload, type: 'access_token' }),
      refresh_token: await this.jwtService.signAsync(
        { id: payload.id, type: 'refresh_token' },
        {
          expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES'),
        },
      ),
    };
  }

  async refreshToken(token: RefreshTokenDto) {
    let refresh;
    try {
      console.log(token.refresh_token);
      refresh = await this.jwtService.verifyAsync(token.refresh_token, {
        secret: process.env.SECRET,
      });
    } catch (error) {
      return ResultData.fail(error.message);
    }
    if (refresh.type !== 'refresh_token') return ResultData.fail('refresh_token无效');
    const user = await this.userService.findOne(refresh.id);
    return ResultData.ok(await this.generateToken({ id: user.id, username: user.name }));
  }

  /**
   * 生成公私钥对
   * @return {{ publicKey: string; privateKey: string }} publicKey: 公钥;privateKey: 私钥
   */
  genRSAKeyPaire(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return { publicKey, privateKey };
  }

  /**
   * 获取公钥
   */
  getPublicKey() {
    return ResultData.ok(process.env.PUBLIC_KEY);
  }

  /**
   * 生成图形验证码
   */
  async genderCaptcha(captchaCif: CaptchaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const captchaResult = new CaptchaResultDto();
      const captcha = create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 0, // 干扰线条数
        width: captchaCif.width || 150, // 宽度
        height: captchaCif.height || 50, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1il', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        background: '',
      });

      const graphicCode = new GraphicCodeNetities();
      graphicCode.code = captcha.text;
      const graphic = await queryRunner.manager.save<GraphicCodeNetities>(graphicCode);

      await queryRunner.commitTransaction();
      captchaResult.id = graphic.id;
      captchaResult.code = captcha.data;
      return ResultData.ok(captchaResult);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 验证accessToken是否有效
   * @param token accessToken
   * @returns Boolean
   */
  async verifyToekn(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 验证码邮件发送
   * @param {string} toEmail 接受端的邮箱
   */
  async senEmailCode(toEmail: string, code: string) {
    await this.mailerService.sendMail({
      to: toEmail,
      subject: '您的验证码',
      html: `<html><body>
        <p><a href="mailto:${toEmail}">${toEmail}</a>您好！</p>
        <p>我们已经收到您要求获取的一次性验证码</p>
        <p>您的验证码为：<b>${code}</b> 有效时间5分钟</p>
        <p>如果您没有要求获取一次性验证码请忽略这封邮件</p>
        <p>谢谢！</p>
        <p>测试邮件</>
      </body></html>`,
    });
  }
}
