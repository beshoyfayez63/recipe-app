import { ActionReducerMap } from '@ngrx/store';
import {
  shoppingListReducer,
  ShoppingState,
} from '../../shopping-list/store/shopping-list.reducer';
import { authReducer, AuthState } from '../auth/auth.reducer';
import { recipeReducer, RecipeState } from '../recipes/recipe.reducer';

export interface AppState {
  shoppingList: ShoppingState;
  auth: AuthState;
  recipes: RecipeState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipes: recipeReducer,
};
