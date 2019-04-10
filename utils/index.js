import jwt from 'jsonwebtoken';

// eslint-disable-next-line import/prefer-default-export
export const signToken = (id, role) => {
  const token = jwt.sign(
    {
      userId: id,
      role,
    },
    process.env.SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1d',
    },
  );
  return token;
};
