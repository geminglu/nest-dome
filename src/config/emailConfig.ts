import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export default registerAs(
  'emailConfig',
  (): MailerOptions => ({
    transport: {
      host: process.env.EMAIL_DOMAIN,
      port: process.env.EMIAL_PORT as unknown as number,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    },
    defaults: {
      from: `"Nestjs" <${process.env.EMAIL_AUTH_USER}>`,
    },
  }),
);
