import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app/app.reducer';
import { loginStart, signupStart } from '../store/auth/auth.actions';
import { AuthState } from '../store/auth/auth.reducer';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loginForm: FormGroup;
  authState$: Observable<AuthState>;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initForm();

    this.authState$ = this.store.select('auth');
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  submitAuthForm() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    if (this.isLoginMode) {
      this.store.dispatch(loginStart({ email, password }));
    } else {
      this.store.dispatch(signupStart({ email, password }));
    }
  }
}
