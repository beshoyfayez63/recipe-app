import { Action, createReducer, on } from '@ngrx/store';

import { Recipe } from 'src/app/recipes/models/recipe.modal';
import {
  addRecipe,
  deleteRecipe,
  setRecipes,
  updateRecipe,
} from './recipe.actions';

export interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe;
}

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
};

const _recipeReducer = createReducer(
  initialState,
  on(addRecipe, (state, action) => ({
    ...state,
    recipes: [...state.recipes, action.recipe],
  })),

  on(updateRecipe, (state, action) => {
    const updateRecipe = {
      ...state.recipes[action.index],
      ...action.recipe,
    };
    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.index] = { ...updateRecipe };
    return { ...state, recipes: updatedRecipes };
  }),

  on(deleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter((_, index) => index !== action.index),
  })),

  on(setRecipes, (state, action) => ({
    ...state,
    recipes: [...action.recipes],
  }))
);

export function recipeReducer(state: RecipeState, action: Action) {
  return _recipeReducer(state, action);
}
