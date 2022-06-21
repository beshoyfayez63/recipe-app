import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/auth/user.model';

export const loginStart = createAction(
  '[AUTH] Login Start',
  props<{ email: string; password: string }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    email: string;
    password: string;
  }>()
);
export const login = createAction(
  '[AUTH] Login',
  props<{
    user: User;
    redirect: boolean;
  }>()
);
export const loginFail = createAction(
  '[AUTH] Login Fail',
  props<{
    errorMessage: string;
  }>()
);

export const autoLogin = createAction('[Auth] Auto Login');

export const logout = createAction('[Auth] Logout');

// export type AuthActions =
//   | Login
//   | LoginFail
//   | LoginStart
//   | Logout
//   | SignupStart
//   | AutoLogin;
