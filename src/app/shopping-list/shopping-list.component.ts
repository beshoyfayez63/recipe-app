import { Ingredient } from './../shared/model/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIngredient } from './store/shopping-list.actions';
import { AppState } from '../store/app/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(selectIngredient({ id: index }));
  }
}
