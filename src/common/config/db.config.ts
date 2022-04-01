import { registerAs } from "@nestjs/config";

export default registerAs('database', () => {
  return {
    type: 'postgres',
    logging: process.env.TYPEORM_LOGGING,
    host: process.env.DB_MAIN_HOST,
    port: parseInt(process.env.DB_MAIN_PORT),
    username: process.env.DB_MAIN_USER,
    password: process.env.DB_MAIN_PASSWORD,
    database: process.env.DB_MAIN_DATABASE,
    autoLoadEntities: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    }
  }
})