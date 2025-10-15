import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getRecipe } from '../appwrite/dbHelper'
import {
    ChefHat, Clock, Users, Flame, Heart, Share2, Bookmark,
    ArrowLeft, Printer, Star, CheckCircle2, Circle, Plus, Minus
} from 'lucide-react';
const RecipeDetail = () => {
    const [Recipe, setRecipe] = useState([])
    const recipeId = useParams()
    const { id } = recipeId;
    useEffect(() => {
        fetchRecipe()
    }, [])

    const fetchRecipe = async () => {
        const DatabaseId = import.meta.env.VITE_APPWRITE_DB_ID
        const RecipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID

        try {
            await getRecipe(DatabaseId, RecipeTableId, id).then((res) => {
                setRecipe(res.rows)

            })
        } catch (error) {

        }
    }
    const recipe = {
        id: 1,
        title: "Creamy Tuscan Chicken",
        description: "A rich and creamy Italian-inspired chicken dish with sun-dried tomatoes and spinach in a garlic parmesan sauce. This restaurant-quality meal comes together in just 45 minutes.",
        difficulty: "Medium",
        servings: 4,
        prepTime: "15 min",
        cookTime: "30 min",
        totalTime: "45 min",
        calories: 425,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=1200&h=600&fit=crop",
        rating: 4.8,
        reviews: 127,
        author: "Chef Maria",
        datePublished: "March 15, 2024",

        ingredients: [
            { id: 1, item: "Chicken breasts, boneless and skinless", amount: "4 pieces (1.5 lbs)" },
            { id: 2, item: "Olive oil", amount: "2 tablespoons" },
            { id: 3, item: "Garlic cloves, minced", amount: "4 cloves" },
            { id: 4, item: "Sun-dried tomatoes, chopped", amount: "1/2 cup" },
            { id: 5, item: "Heavy cream", amount: "1 cup" },
            { id: 6, item: "Chicken broth", amount: "1/2 cup" },
            { id: 7, item: "Parmesan cheese, grated", amount: "1/2 cup" },
            { id: 8, item: "Fresh spinach", amount: "3 cups" },
            { id: 9, item: "Italian seasoning", amount: "1 teaspoon" },
            { id: 10, item: "Salt and pepper", amount: "to taste" }
        ],

        instructions: [
            {
                id: 1,
                step: "Prepare the chicken",
                detail: "Season chicken breasts with salt, pepper, and Italian seasoning on both sides. Pat dry with paper towels for better searing."
            },
            {
                id: 2,
                step: "Sear the chicken",
                detail: "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook for 5-6 minutes per side until golden brown and cooked through. Remove and set aside."
            },
            {
                id: 3,
                step: "Make the sauce",
                detail: "In the same skillet, add minced garlic and sun-dried tomatoes. Sauté for 1 minute until fragrant. Pour in chicken broth and scrape up any browned bits from the pan."
            },
            {
                id: 4,
                step: "Add cream and cheese",
                detail: "Reduce heat to medium-low. Stir in heavy cream and parmesan cheese. Simmer for 3-4 minutes until the sauce thickens slightly, stirring occasionally."
            },
            {
                id: 5,
                step: "Add spinach",
                detail: "Add fresh spinach to the sauce and cook for 2-3 minutes until wilted. Season with additional salt and pepper if needed."
            },
            {
                id: 6,
                step: "Combine and serve",
                detail: "Return the chicken to the skillet, spooning sauce over the top. Simmer for 2 minutes to heat through. Serve hot with pasta, rice, or crusty bread."
            }
        ],

        tips: [
            "Pound chicken breasts to even thickness for uniform cooking",
            "Use full-fat cream for the richest, creamiest sauce",
            "Don't skip the sun-dried tomatoes - they add incredible flavor",
            "Fresh spinach works better than frozen for this recipe"
        ],

        nutrition: {
            calories: 425,
            protein: "42g",
            carbs: "12g",
            fat: "24g",
            fiber: "2g"
        }
    };

    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [servings, setServings] = useState(recipe.servings);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [checkedIngredients, setCheckedIngredients] = useState([]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
            case 'medium':
                return 'bg-primary/20 text-primary-foreground border-primary/30';
            case 'hard':
                return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const adjustServings = (amount) => {
        const newServings = Math.max(1, servings + amount);
        setServings(newServings);
    };

    const toggleStep = (id) => {
        setCheckedSteps(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleIngredient = (id) => {
        setCheckedIngredients(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[500px] bg-muted overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                {/* Back Button */}
                <button className="absolute top-6 left-6 p-3 bg-background/90 backdrop-blur-sm hover:bg-background rounded-full text-foreground transition-colors shadow-lg">
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${isFavorite
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-background/90 hover:bg-background text-foreground'
                            }`}
                    >
                        <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${isBookmarked
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background/90 hover:bg-background text-foreground'
                            }`}
                    >
                        <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>

                    <button className="p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground transition-colors shadow-lg">
                        <Share2 className="w-5 h-5" />
                    </button>

                    <button className="p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground transition-colors shadow-lg">
                        <Printer className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2">
                        {/* Title Card */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl mb-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty}
                                        </span>
                                        <div className="flex items-center gap-1 text-secondary">
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="font-semibold text-foreground">{recipe.rating}</span>
                                            <span className="text-muted-foreground text-sm">({recipe.reviews} reviews)</span>
                                        </div>
                                    </div>

                                    <h1 className="text-4xl font-bold text-card-foreground mb-3">
                                        {recipe.title}
                                    </h1>

                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {recipe.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ChefHat className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Recipe by</p>
                                        <p className="font-semibold text-card-foreground">{recipe.author}</p>
                                    </div>
                                </div>

                                <div className="h-12 w-px bg-border" />

                                <div>
                                    <p className="text-sm text-muted-foreground">Published</p>
                                    <p className="font-semibold text-card-foreground">{recipe.datePublished}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients Section */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <ChefHat className="w-5 h-5 text-primary" />
                                    </div>
                                    Ingredients
                                </h2>

                                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                                    <button
                                        onClick={() => adjustServings(-1)}
                                        className="p-2 hover:bg-background rounded transition-colors"
                                        disabled={servings <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-1 font-semibold text-foreground">
                                        {servings} servings
                                    </span>
                                    <button
                                        onClick={() => adjustServings(1)}
                                        className="p-2 hover:bg-background rounded transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recipe.ingredients.map((ingredient) => (
                                    <button
                                        key={ingredient.id}
                                        onClick={() => toggleIngredient(ingredient.id)}
                                        className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                                    >
                                        {checkedIngredients.includes(ingredient.id) ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground" />
                                        )}
                                        <div className="flex-1">
                                            <span className={`text-card-foreground ${checkedIngredients.includes(ingredient.id) ? 'line-through opacity-50' : ''}`}>
                                                {ingredient.item}
                                            </span>
                                            <span className="text-muted-foreground ml-2 text-sm">
                                                — {ingredient.amount}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-6">
                            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                    <Flame className="w-5 h-5 text-secondary" />
                                </div>
                                Instructions
                            </h2>

                            <div className="space-y-6">
                                {recipe.instructions.map((instruction, index) => (
                                    <button
                                        key={instruction.id}
                                        onClick={() => toggleStep(instruction.id)}
                                        className="w-full text-left group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${checkedSteps.includes(instruction.id)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                                                    }`}>
                                                    {checkedSteps.includes(instruction.id) ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className={`font-semibold text-lg mb-2 ${checkedSteps.includes(instruction.id)
                                                    ? 'text-muted-foreground line-through'
                                                    : 'text-card-foreground'
                                                    }`}>
                                                    {instruction.step}
                                                </h3>
                                                <p className={`text-muted-foreground leading-relaxed ${checkedSteps.includes(instruction.id) ? 'opacity-50' : ''
                                                    }`}>
                                                    {instruction.detail}
                                                </p>
                                            </div>
                                        </div>

                                        {index < recipe.instructions.length - 1 && (
                                            <div className="ml-5 mt-4 mb-2 h-8 w-px bg-border" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tips Section */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-card-foreground mb-6">
                                Pro Tips
                            </h2>

                            <div className="space-y-3">
                                {recipe.tips.map((tip, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Star className="w-3.5 h-3.5 text-secondary" />
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Quick Stats */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6 sticky top-6">
                            <h3 className="font-semibold text-card-foreground mb-4">Quick Info</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Prep Time</p>
                                        <p className="font-semibold text-card-foreground">{recipe.prepTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Flame className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cook Time</p>
                                        <p className="font-semibold text-card-foreground">{recipe.cookTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Time</p>
                                        <p className="font-semibold text-card-foreground">{recipe.totalTime}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Servings</p>
                                        <p className="font-semibold text-card-foreground">{recipe.servings} people</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <h4 className="font-semibold text-card-foreground mb-3">Nutrition (per serving)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Calories</p>
                                        <p className="font-bold text-card-foreground">{recipe.nutrition.calories}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Protein</p>
                                        <p className="font-bold text-card-foreground">{recipe.nutrition.protein}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Carbs</p>
                                        <p className="font-bold text-card-foreground">{recipe.nutrition.carbs}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Fat</p>
                                        <p className="font-bold text-card-foreground">{recipe.nutrition.fat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-12" />
        </div>
    );
}

export default RecipeDetail