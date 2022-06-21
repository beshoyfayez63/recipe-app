import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/model/ingredient.model';

export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<{
    ingredient: Ingredient;
  }>()
);

export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{
    ingredients: Ingredient[];
  }>()
);

export const selectIngredient = createAction(
  '[Shopping List] Select Ingredient',
  props<{
    id: number;
  }>()
);

export const updateIngredient = createAction(
  '[Shopping List] Update Ingredient',
  props<{
    ingredient: Ingredient;
  }>()
);

export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredient'
);

export const stopEdit = createAction('[Shopping List] Cancel Edit');
