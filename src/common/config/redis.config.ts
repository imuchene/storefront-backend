import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    db: process.env.REDIS_DB,
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PREFIX,
  };
});
