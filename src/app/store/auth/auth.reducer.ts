import { Action, createReducer, on } from '@ngrx/store';

import { User } from 'src/app/auth/user.model';
import {
  login,
  loginFail,
  loginStart,
  logout,
  signupStart,
} from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

const _authReducer = createReducer(
  initialState,
  on(loginStart, signupStart, (state) => ({
    ...state,
    authError: null,
    loading: true,
  })),

  on(login, (state, action) => ({
    ...state,
    authError: null,
    loading: false,
    user: action.user,
  })),
  on(loginFail, (state, action) => ({
    ...state,
    user: null,
    authError: action.errorMessage,
    loading: false,
  })),
  on(logout, (state) => ({
    ...state,
    user: null,
  }))
);

export function authReducer(state: AuthState, action: Action) {
  return _authReducer(state, action);
}

// export function authReducer(state = initialState, action: AuthActions) {
//   switch (action.type) {
//     case LOGIN_START:
//     case SIGNUP_START:
//       return {
//         ...state,
//         authError: null,
//         loading: true,
//       };

//     case LOGIN:
//       return {
//         ...state,
//         authError: null,
//         user: action.payload.user,
//         loading: false,
//       };
//     case LOGIN_FAIL:
//       return {
//         ...state,
//         authError: action.payload,
//         user: null,
//         loading: false,
//       };
//     case LOGOUT:
//       return {
//         ...state,
//         user: null,
//       };
//     default:
//       return state;
//   }
// }
