import { Ingredient } from './../../shared/model/ingredient.model';
export class Recipe {
  constructor(
    public name: string,
    public description: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {}
}
