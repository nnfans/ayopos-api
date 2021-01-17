export default (): Record<string, unknown> => ({
  jwt: {
    secret: process.env.SECRET,
    signOptions: { expiresIn: '2h' },
  },
});
