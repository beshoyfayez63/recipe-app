import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.modal';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes = new BehaviorSubject<Recipe[]>([]);

  recipeSelected = new BehaviorSubject<Recipe>(null);

  getRecipes() {
    return this.recipes.asObservable();
  }

  selectNewRecipe(recipe) {
    this.recipeSelected.next(recipe);
  }

  getRecipeById(index: number) {
    return this.recipes.value[index];
  }

  editRecipe(index: number, selectedRecipe: Recipe) {
    const recipes = this.recipes.value;

    recipes[index] = selectedRecipe;
    this.recipes.next(recipes);
  }

  addRecipe(selectedRecipe) {
    const recipes = [...this.recipes.value];
    recipes.push({ ...selectedRecipe });
    this.recipes.next(recipes);
  }

  addRecipes(recipes: Recipe[]) {
    this.recipes.next(recipes);
  }

  deleteRecipe(index: number) {
    const recipes = this.recipes.value;
    recipes.splice(index, 1);
    this.recipes.next(recipes);
  }
}
