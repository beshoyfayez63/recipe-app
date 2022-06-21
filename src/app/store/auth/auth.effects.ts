import { Injectable } from '@angular/core';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import {
  autoLogin,
  login,
  loginStart,
  logout,
  signupStart,
  loginFail,
} from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

const handleAuthentication = (
  resData: AuthResponseData,
  authService: AuthService
) => {
  const expirtaionDate = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );
  const user = new User(
    resData.email,
    resData.localId,
    resData.idToken,
    expirtaionDate
  );
  authService.setLogoutTimer(+resData.expiresIn * 1000);
  localStorage.setItem('userData', JSON.stringify(user));
  return login({ user, redirect: true });
};

const handleAuthError = (errorRes) => {
  switch (errorRes.error.error.message) {
    case 'EMAIL_NOT_FOUND':
      return of(loginFail({ errorMessage: 'Email not found.!' }));
    case 'INVALID_PASSWORD':
      return of(loginFail({ errorMessage: 'Invalid Password.!' }));
    default:
      return of(loginFail({ errorMessage: 'An Error occurred!' }));
  }
};

// Actions is a big observable that will give you access to all dispatched actions
@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(signupStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => handleAuthentication(resData, this.authService)),
            catchError((errorRes) => handleAuthError(errorRes))
          );
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginStart),
      switchMap((authData) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => handleAuthentication(resData, this.authService)),
            catchError((errorRes) => handleAuthError(errorRes))
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(login),
        tap((action) => action.redirect && this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) return { type: 'DUMMY' };
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          // return new Login({ user: loadedUser, redirect: false });
          return login({ user: loadedUser, redirect: false });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}
}
