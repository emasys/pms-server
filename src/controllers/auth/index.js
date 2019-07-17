import {
  signUpOptions, signInOptions, changeRoleOptions, deleteUserOptions,
} from './options';
import Auth from './services';

export const createUser = {
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

export const login = {
  path: '/auth/signin',
  method: 'POST',
  options: signInOptions,
  handler(request, h) {
    const { payload } = request;
    const auth = new Auth(this.model, h);
    return auth.login(payload);
  },
};

export const changeRole = {
  path: '/user/{userId}',
  method: 'PUT',
  options: changeRoleOptions,
  handler(request, h) {
    const { userId } = request.params;
    const { role } = request.payload;
    const user = new Auth(this.model, h);
    return user.changeRole(userId, role);
  },
};

export const deleteUser = {
  path: '/user/{userId}',
  method: 'DELETE',
  options: deleteUserOptions,
  handler(request, h) {
    const { userId } = request.params;
    const user = new Auth(this.model, h);
    return user.deleteUser(userId);
  },
};
