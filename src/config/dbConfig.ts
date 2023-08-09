import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['/entities/*.ts'],
  logger: 'file',
  logging: true,
  autoLoadEntities: true,
  synchronize: false,
  timezone: 'UTC',
}));
