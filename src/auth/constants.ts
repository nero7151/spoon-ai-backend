export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'defaultSecretKey',
  expiresIn: '1h',
};

export const securityConstants = {
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};
