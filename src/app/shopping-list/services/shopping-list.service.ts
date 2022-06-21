import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Ingredient } from 'src/app/shared/model/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private ingredients = new BehaviorSubject<Ingredient[]>([]);

  ingredient = new BehaviorSubject<Ingredient>(null);
  ingredientIndex = new BehaviorSubject<number>(null);

  getIngredients() {
    return this.ingredients.asObservable();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.next(this.ingredients.getValue().concat([ingredient]));
  }

  onEditIngredient(index: number) {
    this.ingredientIndex.next(index);
    const ingredient = this.ingredients.value[index];
    this.ingredient.next(ingredient);
  }

  onUpdateIngredient(index: number, name: string, amount: number) {
    const ingredients = [...this.ingredients.value];
    ingredients[index] = new Ingredient(name, amount);
    this.ingredients.next(ingredients);
  }

  onDeleteIngredient(index: number) {
    const ingredients = [...this.ingredients.value];
    ingredients.splice(index, 1);
    this.ingredients.next(ingredients);
  }
}
