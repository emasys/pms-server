import { signUpOptions, signInOptions } from './options';
import Auth from './services';

const createUser = {
  path: '/auth/signup',
  method: 'POST',
  options: signUpOptions,
  handler(request, h) {
    const { payload } = request;
    const role = payload.username === process.env.ADMIN ? 'admin' : 'user';
    payload.role = role;
    const auth = new Auth(this.model, h);
    return auth.register(payload);
  },
};

const login = {
  path: '/auth/signin',
  method: 'POST',
  options: signInOptions,
  handler(request, h) {
    const { payload } = request;
    const auth = new Auth(this.model, h);
    return auth.login(payload);
  },
};

export { createUser, login };
