import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app/app.reducer';
import { map, switchMap } from 'rxjs';
import { deleteRecipe } from 'src/app/store/recipes/recipe.actions';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  // recipe: Recipe;
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param) => +param.get('id')),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) => {
          return recipeState.recipes.find((r, index) => index === this.id);
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  addToShoppingList() {
    this.store.dispatch(
      addIngredients({ ingredients: this.recipe.ingredients })
    );
  }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe(id: number) {
    this.store.dispatch(deleteRecipe({ index: id }));
  }
}
