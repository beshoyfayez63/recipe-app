import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../models/recipe.modal';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app/app.reducer';
import { map, switchMap } from 'rxjs';
import { addRecipe, updateRecipe } from 'src/app/store/recipes/recipe.actions';
// import { AddRecipe, UpdateRecipe } from 'src/app/store/recipes/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  selectedRecipe: Recipe;

  recipeForm: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param) => {
          if (!param.has('id')) return null;
          return +param.get('id');
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) => {
          return recipeState.recipes.find((r, index) => index === this.id);
        })
      )
      .subscribe((recipe) => {
        this.selectedRecipe = recipe;
        this.editMode = +this.id >= 0 && this.id !== null ? true : false;

        this.initForm();
      });
  }

  private initForm() {
    let ingredientsControl = this.fb.array([]);
    if (this.editMode) {
      if (this.selectedRecipe?.ingredients.length) {
        for (let ing of this.selectedRecipe.ingredients) {
          ingredientsControl.push(
            this.fb.group({
              name: this.fb.control(ing.name, Validators.required),
              amount: this.fb.control(ing.amount, Validators.required),
            })
          );
        }
      }
    }
    this.recipeForm = this.fb.group({
      name: [this.selectedRecipe?.name || '', Validators.required],
      imagePath: [this.selectedRecipe?.imagePath || '', Validators.required],
      description: [
        this.selectedRecipe?.description || '',
        Validators.required,
      ],
      ingredients: ingredientsControl,
    });
  }

  getIngredientsControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      this.fb.group({
        name: ['', Validators.required],
        amount: [null, [Validators.required, Validators.min(1)]],
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  addRecipe() {
    if (this.editMode) {
      this.store.dispatch(
        updateRecipe({
          index: this.id,
          recipe: {
            ...this.recipeForm.value,
            ingredients: [...this.recipeForm.value.ingredients],
          },
        })
      );
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(addRecipe({ recipe: this.recipeForm.value }));
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
