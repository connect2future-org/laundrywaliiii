import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword) => {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const verifyPassword = async (plainPassword, hash) => {
  if (!plainPassword || !hash) return false;
  return bcrypt.compare(plainPassword, hash);
};

