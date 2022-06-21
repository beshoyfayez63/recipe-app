import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app/app.reducer';
import { logout } from '../store/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private store: Store<AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (!this.tokenExpirationTimer) return;
    clearTimeout(this.tokenExpirationTimer);
  }
}
