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
}

export default registerAs(
  'config',
  (): configType => ({
    verifyCodeExpirationTime: process.env.GRAPHIC_EXPIRATION_TIME || '1500000',
    secret: process.env.SECRET || 'SECRET',
  }),
);
