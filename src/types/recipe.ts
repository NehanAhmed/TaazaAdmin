export interface RecipeIngredient {
  name: string;
  amount: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
}

export interface RecipeCookingTime {
  prep: number;
  cook: number;
  total: number;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface RecipeResponse {
  title: string;
  slogan: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  proTips: string[];
  cookingTime: RecipeCookingTime;
  nutrition: RecipeNutrition;
}