import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/model/ingredient.model';
import { AppState } from 'src/app/store/app/app.reducer';
import {
  updateIngredient,
  stopEdit,
  addIngredient,
  deleteIngredient,
} from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editShopping: FormGroup;
  ingredient: Ingredient;
  editMode = false;

  private subs$: Subscription[] = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initForm();
    this.subs$.push(this.getEditableIngredient());
  }

  getEditableIngredient() {
    return this.store.select('shoppingList').subscribe((shoppingList) => {
      this.ingredient = shoppingList.ingredient;

      if (this.ingredient) {
        this.editShopping.setValue({
          name: this.ingredient.name,
          amount: +this.ingredient.amount,
        });
        this.editMode = true;
      }
    });
  }

  initForm() {
    this.editShopping = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  editShoppingList() {
    const name = this.editShopping.value.name;
    const amount = this.editShopping.value.amount;
    if (this.editMode) {
      this.store.dispatch(
        updateIngredient({ ingredient: new Ingredient(name, +amount) })
      );
      this.store.dispatch(stopEdit());
    } else {
      this.store.dispatch(
        addIngredient({ ingredient: new Ingredient(name, +amount) })
      );
    }
    this.editMode = false;
    this.editShopping.reset();
  }

  deleteIngredient() {
    this.store.dispatch(deleteIngredient());
    this.clearForm();
  }

  clearForm() {
    this.editShopping.reset();
    this.store.dispatch(stopEdit());
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.clearForm();
    this.subs$.forEach((s) => s.unsubscribe());
  }
}
