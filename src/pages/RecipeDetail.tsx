import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getRecipe } from '../appwrite/dbHelper';
import {
    ChefHat, Clock, Users, Flame, Heart, Share2, Bookmark,
    ArrowLeft, Printer, Star, CheckCircle2, Circle, Plus, Minus,
    Ellipsis,
    Trash
} from 'lucide-react';
import { LoaderOne } from '../components/ui/loader';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
const RecipeDetail = () => {
    const [Recipe, setRecipe] = useState({});
    const [aiResponse, setaiResponse] = useState(null);
    const recipeId = useParams();
    const { id } = recipeId;
    const [loading, setloading] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [servings, setServings] = useState(4);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [isVerifiedForPublishingInLibrary, setisVerifiedForPublishingInLibrary] = useState(true)
    useEffect(() => {
        setloading(true)
        fetchRecipe();
    }, []);

    const fetchRecipe = async () => {
        const DatabaseId = import.meta.env.VITE_APPWRITE_DB_ID;
        const RecipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID;
        try {
            const res = await getRecipe(DatabaseId, RecipeTableId, id);
            const recipes = res.rows[0];
            const aiResponseFrom = res.rows[0].aiResponse;
            setloading(false)
            // Parse AI response if it's a string
            const parsedAiResponse = typeof aiResponseFrom === 'string'
                ? JSON.parse(aiResponseFrom)
                : aiResponseFrom;

            setaiResponse(parsedAiResponse);
            setRecipe(recipes);
            setServings(recipes.servings || 4);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
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

    const handlePrint = () => {
        window.print()
    }

    const adjustServings = (amount) => {
        const newServings = Math.max(1, servings + amount);
        setServings(newServings);
    };

    const toggleStep = (index) => {
        setCheckedSteps(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleIngredient = (index) => {
        setCheckedIngredients(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return loading ? <LoadingState /> : (
        <div className="min-h-screen bg-background font-poppins">
            {/* Hero Section */}
            <div className="relative h-[500px] bg-muted overflow-hidden">
                <img
                    src='/Images/random_photos(1).jpg'
                    alt={Recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                {/* Back Button */}
                <Link to='/recipes'>
                
                <Button className="absolute top-6 left-6 p-3 bg-background/90 backdrop-blur-sm hover:bg-background rounded-full text-foreground transition-colors shadow-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                </Link>
                

                {/* Action Buttons */}
                {isVerifiedForPublishingInLibrary && (
                    <div className="absolute top-6 right-6 flex gap-3">
                        <Button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${isFavorite
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-background/90 hover:bg-background text-foreground'
                                }`}
                        >
                            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                        </Button>
                        <Button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${isBookmarked
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background/90 hover:bg-background text-foreground'
                                }`}
                        >
                            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </Button>

                        <Button onClick={handlePrint} className="p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground transition-colors shadow-lg">
                            <Printer className="w-5 h-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button className='p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground transition-colors shadow-lg'>
                                    <Ellipsis />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='left'>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className='flex justify-around' variant='destructive'>
                                        Delete
                                        <Trash />
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                )}

                {!isVerifiedForPublishingInLibrary && (
                    <Button size={'lg'} variant="default">
                        Publish To Library
                    </Button>
                )}


            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 font-poppins">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2">
                        {/* Title Card */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl mb-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getDifficultyColor(Recipe.difficulty)}`}>
                                            {Recipe.difficulty}
                                        </span>
                                        <div className="flex items-center gap-1 text-secondary">
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                    </div>
                                    <h1 className="text-4xl font-bold text-card-foreground mb-3">
                                        {aiResponse?.title || Recipe.title}
                                    </h1>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {aiResponse?.slogan || Recipe.description}
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
                                        <p className="font-semibold text-card-foreground">Chef</p>
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-border" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Published</p>
                                    <p className="font-semibold text-card-foreground">
                                        {Recipe.$createdAt ? new Date(Recipe.$createdAt).toLocaleDateString() : 'Recently'}
                                    </p>
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

                            </div>
                            <div className="space-y-3">
                                {aiResponse?.ingredients?.map((ingredient, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleIngredient(index)}
                                        className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors text-left group"
                                    >
                                        {checkedIngredients.includes(index) ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-foreground" />
                                        )}
                                        <div className="flex-1">
                                            <span className={`text-card-foreground ${checkedIngredients.includes(index) ? 'line-through opacity-50' : ''}`}>
                                                {ingredient.name}
                                            </span>
                                            <span className="text-muted-foreground ml-2 text-sm">
                                                — {ingredient.amount}
                                            </span>
                                            {ingredient.notes && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    {ingredient.notes}
                                                </p>
                                            )}
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
                                {aiResponse?.instructions?.map((instruction, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleStep(index)}
                                        className="w-full text-left group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${checkedSteps.includes(index)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                                                    }`}>
                                                    {checkedSteps.includes(index) ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : (
                                                        instruction.step
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-muted-foreground leading-relaxed ${checkedSteps.includes(index) ? 'opacity-50 line-through' : ''}`}>
                                                    {instruction.instruction}
                                                </p>
                                            </div>
                                        </div>
                                        {index < aiResponse.instructions.length - 1 && (
                                            <div className="ml-5 mt-4 mb-2 h-8 w-px bg-border" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tips Section */}
                        {aiResponse?.proTips && aiResponse.proTips.length > 0 && (
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                                <h2 className="text-2xl font-bold text-card-foreground mb-6">
                                    Pro Tips
                                </h2>
                                <div className="space-y-3">
                                    {aiResponse.proTips.map((tip, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Star className="w-3.5 h-3.5 text-secondary" />
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                        <p className="font-semibold text-card-foreground">
                                            {aiResponse?.cookingTime?.prep || 0} min
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Flame className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cook Time</p>
                                        <p className="font-semibold text-card-foreground">
                                            {aiResponse?.cookingTime?.cook || 0} min
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Time</p>
                                        <p className="font-semibold text-card-foreground">
                                            {aiResponse?.cookingTime?.total || 0} min
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Servings</p>
                                        <p className="font-semibold text-card-foreground">{servings} people</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <h4 className="font-semibold text-card-foreground mb-3">Nutrition (per serving)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Calories</p>
                                        <p className="font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.calories || 0}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Protein</p>
                                        <p className="font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.protein || 0}g
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Carbs</p>
                                        <p className="font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.carbs || 0}g
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Fat</p>
                                        <p className="font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.fat || 0}g
                                        </p>
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
};

const LoadingState = () => {
    return (
        <div className='w-full h-screen m-auto'>
            <LoaderOne />
        </div>
    )
}
export default RecipeDetail;