export default (): Record<string, unknown> => ({
  postgresTest: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'dev',
    database: 'ayopos-test',
    autoLoadEntities: true,
    synchronize: true,
  },
  redisTest: {
    host: '127.0.0.1',
    password: '',
    keyPrefix: '',
  },
});
