import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_for_dev', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as any,
  });
};
