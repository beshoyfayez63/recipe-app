import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from 'src/app/recipes/models/recipe.modal';
import { AppState } from '../app/app.reducer';
import { fetchRecipes, setRecipes, storeRecipes } from './recipe.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() =>
    this.action$.pipe(
      ofType(fetchRecipes),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(
            'https://angular-http-988be-default-rtdb.firebaseio.com/recipes.json'
          )
          .pipe(
            map((recipes) => {
              recipes = recipes.map((recipe) => {
                if (!recipe?.ingredients) {
                  recipe.ingredients = [];
                }
                return recipe;
              });
              return recipes;
            }),
            map((recipes) => {
              return setRecipes({ recipes });
            })
          );
      })
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipeState]) => {
          return this.http.put<Recipe[]>(
            'https://angular-http-988be-default-rtdb.firebaseio.com/recipes.json',
            recipeState.recipes
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
