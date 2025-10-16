import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { deleteRecipe, getRecipe } from '../appwrite/dbHelper';
import {
    ChefHat, Clock, Users, Flame, Heart, Share2, Bookmark,
    ArrowLeft, Printer, Star, CheckCircle2, Circle, Plus, Minus,
    Ellipsis,
    Trash,
    TrendingUp,
    Award
} from 'lucide-react';
import { LoaderOne } from '../components/ui/loader';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { toast } from 'sonner';

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
    const navigate = useNavigate()
    useEffect(() => {
        setloading(true)
        fetchRecipe();
    }, []);
    const handleDelete = async() => {
        const databaseId = import.meta.env.VITE_APPWRITE_DB_ID
        const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID
        const recipeId = Recipe.$id;
        try {
            await deleteRecipe(databaseId,recipeTableId,recipeId).then(()=>{
                toast.success("Recipe Deleted Succesfully!")
                setTimeout(()=>{
                    navigate('/recipes')
                },2000)
            })
        } catch (error) {
            throw error;
        }
    }
    const fetchRecipe = async () => {
        const DatabaseId = import.meta.env.VITE_APPWRITE_DB_ID;
        const RecipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID;
        try {
            const res = await getRecipe(DatabaseId, RecipeTableId, id);
            const recipes = res.rows[0];
            const aiResponseFrom = res.rows[0].aiResponse;
            setloading(false)
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
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-emerald-500/10';
            case 'medium':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-amber-500/10';
            case 'hard':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-rose-500/10';
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

    const completionPercentage = aiResponse?.instructions
        ? Math.round((checkedSteps.length / aiResponse.instructions.length) * 100)
        : 0;

    return loading ? <LoadingState /> : (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 font-poppins">
            {/* Hero Section - Enhanced with better overlay */}
            <div className="relative h-[560px] bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay" />
                <img
                    src='/Images/random_photos(1).jpg'
                    alt={Recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

                {/* Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
                    <Link to='/recipes'>
                        <Button className="px-4 py-2.5 bg-background/95 backdrop-blur-md hover:bg-background rounded-xl text-foreground transition-all shadow-lg hover:shadow-xl border border-border/50 hover:scale-105 active:scale-95">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="font-medium">Back</span>
                        </Button>
                    </Link>

                    {/* Action Buttons - Redesigned */}
                    {isVerifiedForPublishingInLibrary && (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`px-4 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg border hover:scale-105 active:scale-95 ${isFavorite
                                        ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-rose-500/20'
                                        : 'bg-background/95 hover:bg-background text-foreground border-border/50'
                                    }`}
                            >
                                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                            </Button>
                            <Button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`px-4 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg border hover:scale-105 active:scale-95 ${isBookmarked
                                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary/50 shadow-primary/20'
                                        : 'bg-background/95 hover:bg-background text-foreground border-border/50'
                                    }`}
                            >
                                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </Button>
                            <Button
                                onClick={handlePrint}
                                className="px-4 py-2.5 rounded-xl bg-background/95 backdrop-blur-md hover:bg-background text-foreground transition-all shadow-lg border border-border/50 hover:scale-105 active:scale-95"
                            >
                                <Printer className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button className='px-4 py-2.5 rounded-xl bg-background/95 backdrop-blur-md hover:bg-background text-foreground transition-all shadow-lg border border-border/50 hover:scale-105 active:scale-95'>
                                        <Ellipsis className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className="w-48">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={handleDelete} className='flex justify-between text-destructive focus:text-destructive cursor-pointer'>
                                            <span>Delete Recipe</span>
                                            <Trash className="w-4 h-4" />
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    {!isVerifiedForPublishingInLibrary && (
                        <Button size={'lg'} className="shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Publish To Library
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-8">
                        {/* Title Card - Enhanced visual hierarchy */}
                        <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-6 hover:shadow-3xl transition-shadow">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className={`px-5 py-2 rounded-full text-sm font-bold border-2 shadow-lg ${getDifficultyColor(Recipe.difficulty)}`}>
                                            {Recipe.difficulty?.toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/30">
                                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">4.8</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-card-foreground mb-4 leading-tight">
                                        {aiResponse?.title || Recipe.title}
                                    </h1>
                                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                                        {aiResponse?.slogan || Recipe.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                                        <ChefHat className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Recipe by</p>
                                        <p className="font-bold text-card-foreground">Chef Master</p>
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-border/60" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Published</p>
                                    <p className="font-bold text-card-foreground">
                                        {Recipe.$createdAt ? new Date(Recipe.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        {checkedSteps.length > 0 && (
                            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-2xl p-5 mb-6 shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        <span className="font-bold text-card-foreground">Cooking Progress</span>
                                    </div>
                                    <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Ingredients Section - Enhanced */}
                        <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl mb-6 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                                        <ChefHat className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    Ingredients
                                </h2>
                                <div className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted rounded-full">
                                    {checkedIngredients.length}/{aiResponse?.ingredients?.length || 0} checked
                                </div>
                            </div>
                            <div className="space-y-2">
                                {aiResponse?.ingredients?.map((ingredient, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleIngredient(index)}
                                        className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-accent/60 transition-all text-left group border border-transparent hover:border-border/40 hover:shadow-md"
                                    >
                                        {checkedIngredients.includes(index) ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className={`font-medium text-card-foreground transition-all ${checkedIngredients.includes(index) ? 'line-through opacity-50' : ''}`}>
                                                    {ingredient.name}
                                                </span>
                                                <span className="text-muted-foreground text-sm font-medium px-2 py-0.5 bg-muted rounded-md">
                                                    {ingredient.amount}
                                                </span>
                                            </div>
                                            {ingredient.notes && (
                                                <p className="text-xs text-muted-foreground mt-2 italic bg-accent/30 px-2 py-1 rounded inline-block">
                                                    💡 {ingredient.notes}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Instructions Section - Enhanced */}
                        <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl mb-6 hover:shadow-2xl transition-shadow">
                            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                                    <Flame className="w-5 h-5 text-secondary-foreground" />
                                </div>
                                Step-by-Step Instructions
                            </h2>
                            <div className="space-y-6">
                                {aiResponse?.instructions?.map((instruction, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleStep(index)}
                                        className="w-full text-left group"
                                    >
                                        <div className="flex gap-5 p-5 rounded-2xl hover:bg-accent/40 transition-all border border-transparent hover:border-border/40 hover:shadow-lg">
                                            <div className="flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all shadow-md ${checkedSteps.includes(index)
                                                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-110 shadow-primary/30'
                                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 border border-border'
                                                    }`}>
                                                    {checkedSteps.includes(index) ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <span className="text-lg">{instruction.step}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className={`text-base leading-relaxed transition-all ${checkedSteps.includes(index)
                                                        ? 'opacity-40 line-through text-muted-foreground'
                                                        : 'text-card-foreground font-medium'
                                                    }`}>
                                                    {instruction.instruction}
                                                </p>
                                            </div>
                                        </div>
                                        {index < aiResponse.instructions.length - 1 && (
                                            <div className="ml-6 mt-3 mb-3 h-6 w-0.5 bg-gradient-to-b from-border to-transparent" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tips Section - Enhanced */}
                        {aiResponse?.proTips && aiResponse.proTips.length > 0 && (
                            <div className="bg-gradient-to-br from-amber-500/5 via-card/80 to-amber-500/5 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
                                <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                                        <Star className="w-5 h-5 text-white fill-white" />
                                    </div>
                                    Pro Tips
                                </h2>
                                <div className="space-y-4">
                                    {aiResponse.proTips.map((tip, index) => (
                                        <div key={index} className="flex gap-4 items-start p-4 rounded-xl bg-card/60 border border-amber-500/10 hover:bg-amber-500/5 transition-all hover:shadow-md">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                                            </div>
                                            <p className="text-card-foreground leading-relaxed font-medium flex-1">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Enhanced */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                                <h3 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Quick Info
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/30 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Clock className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Prep Time</p>
                                            <p className="text-lg font-bold text-card-foreground">
                                                {aiResponse?.cookingTime?.prep || 0} min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/30 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Flame className="w-6 h-6 text-secondary-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Cook Time</p>
                                            <p className="text-lg font-bold text-card-foreground">
                                                {aiResponse?.cookingTime?.cook || 0} min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/30 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Clock className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Time</p>
                                            <p className="text-lg font-bold text-card-foreground">
                                                {aiResponse?.cookingTime?.total || 0} min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/30 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg flex-shrink-0">
                                            <Users className="w-6 h-6 text-secondary-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Servings</p>
                                            <p className="text-lg font-bold text-card-foreground">{servings} people</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nutrition Info */}
                            <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                                <h4 className="text-xl font-bold text-card-foreground mb-5 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Nutrition Per Serving
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 hover:shadow-md transition-all">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Calories</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.calories || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">kcal</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:shadow-md transition-all">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Protein</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.protein || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">grams</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:shadow-md transition-all">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Carbs</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.carbs || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">grams</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:shadow-md transition-all">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Fat</p>
                                        <p className="text-2xl font-bold text-card-foreground">
                                            {aiResponse?.nutrition?.fat || 0}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">grams</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingState = () => {
    return (
        <div className='w-full h-screen m-auto flex items-center justify-center'>
            <LoaderOne />
        </div>
    )
}

export default RecipeDetail;