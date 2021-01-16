export default (): Record<string, unknown> => ({
  app: {
    env: process.env.ENV || 'production',
    listenPort: process.env.APP_PORT || 8080,
    secret: process.env.SECRET,
    cors: process.env.CORS_ORIGIN || '',
  },
});
