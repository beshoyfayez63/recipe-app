import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../auth/user.model';
import { AppState } from '../store/app/app.reducer';
import { logout } from '../store/auth/auth.actions';
import { storeRecipes, fetchRecipes } from '../store/recipes/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  auth: Observable<{ user: User }>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.auth = this.store.select('auth');
  }
  storeRecipe() {
    // this.dataStorage.storeRecipes();
    this.store.dispatch(storeRecipes());
  }

  getRecipes() {
    // this.dataStorage.getRecipes().subscribe();
    this.store.dispatch(fetchRecipes());
  }

  logout() {
    this.store.dispatch(logout());
  }
}
