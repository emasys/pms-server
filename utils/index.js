import jwt from 'jsonwebtoken';
/* eslint-disable import/prefer-default-export */

export const signToken = (username, id) => {
  const token = jwt.sign(
    {
      username,
      userId: id,
    },
    process.env.SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1d',
    },
  );
  return token;
};
