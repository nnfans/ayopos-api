export default (): Record<string, unknown> => ({
  postgres: {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    autoLoadEntities: true,
    synchronize: process.env.ENV !== 'producton',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASS || '',
    keyPrefix: process.env.REDIS_PREFIX || '',
  },
});
