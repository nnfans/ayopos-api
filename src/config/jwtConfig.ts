export default () => ({
  jwt: {
    secret: process.env.SECRET,
    signOptions: { expiresIn: '2h' },
  },
});
