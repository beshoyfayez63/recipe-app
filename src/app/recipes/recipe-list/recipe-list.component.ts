import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { AppState } from 'src/app/store/app/app.reducer';
import { RecipeState } from 'src/app/store/recipes/recipe.reducer';
import { Recipe } from '../models/recipe.modal';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Observable<RecipeState>;

  private subs$: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // this.subs$.push(this.initRecipes());
    this.recipes = this.store.select('recipes');
    // this.store.select('recipes').subscribe();
  }

  initRecipes() {
    return this.route.data.subscribe((data: Data) => {
      this.recipes = data['recipes'];
    });
  }

  addNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subs$.forEach((s) => s.unsubscribe());
  }
}
