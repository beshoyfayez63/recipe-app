import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, take, takeUntil, tap } from 'rxjs';
import { AppState } from 'src/app/store/app/app.reducer';
import { fetchRecipes, setRecipes } from 'src/app/store/recipes/recipe.actions';
// import {
//   FetchRecipe,
//   SetRecipe,
//   SET_RECIPES,
// } from 'src/app/store/recipes/recipe.actions';
import { Recipe } from '../models/recipe.modal';

@Injectable({ providedIn: 'root' })
export class RecipeRsolver implements Resolve<Recipe[]> {
  recipes = new BehaviorSubject<Recipe[]>(null);
  constructor(private store: Store<AppState>, private action$: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> {
    // return this.dataStorage.getRecipes();
    this.store.dispatch(fetchRecipes());
    return this.action$.pipe(
      ofType(setRecipes),
      take(1),
      map((recipeState) => {
        return recipeState.recipes;
      })
    );
  }
}
