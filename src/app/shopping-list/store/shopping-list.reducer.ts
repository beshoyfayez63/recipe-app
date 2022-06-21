import { Action, createReducer, on } from '@ngrx/store';

import { Ingredient } from '../../shared/model/ingredient.model';
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  selectIngredient,
  stopEdit,
  updateIngredient,
} from './shopping-list.actions';

export interface ShoppingState {
  ingredient: Ingredient;
  ingredients: Ingredient[];
  id: number;
}

export interface AppState {
  shoppingList: ShoppingState;
}

const initialState: ShoppingState = {
  ingredient: null,
  id: null,
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Bannana', 2)],
};

const _shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.ingredient],
  })),
  on(addIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.ingredients],
  })),
  on(updateIngredient, (state, action) => {
    const ingredients = [...state.ingredients];
    const updatedIngredient = {
      ...ingredients[state.id],
      ...action.ingredient,
    };
    ingredients[state.id] = updatedIngredient;
    return {
      ...state,
      ingredients,
      ingredient: null,
      id: null,
    };
  }),

  on(deleteIngredient, (state) => {
    const filteredIngredients = [...state.ingredients];
    filteredIngredients.splice(state.id, 1);

    return {
      ...state,
      ingredients: filteredIngredients,
      ingredient: null,
      id: null,
    };
  }),

  on(selectIngredient, (state, action) => ({
    ...state,
    ingredient: { ...state.ingredients[action.id] },
    id: action.id,
  })),
  on(stopEdit, (state, action) => ({ ...state, ingredient: null, id: null }))
);

export function shoppingListReducer(state: ShoppingState, action: Action) {
  return _shoppingListReducer(state, action);
}
