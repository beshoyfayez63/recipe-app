import { RecipeService } from './../../recipes/services/recipe.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs';
import { Recipe } from 'src/app/recipes/models/recipe.modal';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app/app.reducer';
import { SetRecipe } from 'src/app/store/recipes/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorage {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<AppState>
  ) {}

  storeRecipes() {
    return this.recipeService
      .getRecipes()
      .pipe(
        take(1),
        switchMap((recipes) => {
          return this.http.put(
            'https://angular-http-988be-default-rtdb.firebaseio.com/recipes.json',
            recipes
          );
        })
      )
      .subscribe(console.log);
  }

  getRecipes() {
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
        tap((recipes) => {
          this.store.dispatch(new SetRecipe(recipes));
        })
      );
  }
}
