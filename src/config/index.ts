import { registerAs } from '@nestjs/config';

export interface configType {
  /**
   * 验证码超时时间
   */
  verifyCodeExpirationTime: string;
  /**
   * JWT_secret
   */
  secret: string;
  /**
   * ACCESS_TOKEN过期时间
   */
  ACCESS_TOKEN_EXPIRES: string;
  /**
   * REFRESH_TOKEN过期时间
   */
  REFRESH_TOKEN_EXPIRES: string;
}

export default registerAs(
  'config',
  (): configType => ({
    verifyCodeExpirationTime: process.env.GRAPHIC_EXPIRATION_TIME || '300000',
    secret: process.env.SECRET || 'SECRET',
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || '36000000',
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || '72000000',
  }),
);
