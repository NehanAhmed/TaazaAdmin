import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Users, TrendingUp, Heart, Share2, Bookmark, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { WobbleCard } from '../components/ui/wobble-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { getAllRecipes } from '../appwrite/dbHelper';
import { th } from 'zod/v4/locales';
const Recipe = () => {
    useEffect(() => {
        fetchRecipe();
    }, [])
    const fetchRecipe = async () => {
        try {
            const DatabaseId = import.meta.env.VITE_APPWRITE_DB_ID;
            const RecipeTableID = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID;
            await getAllRecipes(DatabaseId, RecipeTableID).then((res) => {
                const recipes = res.rows;
                setRecipes(recipes);

            })
        } catch (error) {
            throw error;
        }
    }
    const { id } = useParams();

    // Sample recipe data - replace with your actual DB data
    const [recipes, setRecipes] = useState([]);


    const [openDropdown, setOpenDropdown] = useState(null);

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

    const toggleFavorite = (id) => {
        setRecipes(recipes.map(recipe =>
            recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
        ));
    };

    const handleDelete = (id) => {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        setOpenDropdown(null);
    };

    const handleEdit = (id) => {
        console.log('Edit recipe:', id);
        setOpenDropdown(null);
    };

    return (
        <div className="font-poppins min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ChefHat className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-extrabold font-poppins text-foreground">My Recipes</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Manage and explore your culinary creations
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Recipes</p>
                                <p className="text-3xl font-bold text-card-foreground mt-1">{recipes.length}</p>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-full">
                                <ChefHat className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Favorites</p>
                                <p className="text-3xl font-bold text-card-foreground mt-1">
                                    {recipes.filter(r => r.isFavorite).length}
                                </p>
                            </div>
                            <div className="bg-destructive/10 p-3 rounded-full">
                                <Heart className="w-6 h-6 text-destructive" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Avg Difficulty</p>
                                <p className="text-3xl font-bold text-card-foreground mt-1">Medium</p>
                            </div>
                            <div className="bg-secondary/10 p-3 rounded-full">
                                <TrendingUp className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recipe Cards Grid */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {recipes.map((recipe) => (

                        <WobbleCard key={recipe.$id} className='z-0 p-4 h-[440px] bg-card ' containerClassName='z-0 p-0 bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group'>

                            {/* Image Container */}
                            <div className="w-full rounded-lg relative h-48 overflow-hidden bg-muted">
                                <img
                                    src='/public/Images/random_photos(1).jpg'
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Top Actions */}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <Button
                                        onClick={() => toggleFavorite(recipe.id)}
                                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${recipe.isFavorite
                                            ? 'bg-destructive text-destructive-foreground'
                                            : 'bg-background/80 text-foreground hover:bg-background'
                                            }`}
                                    >
                                        <Heart
                                            className="w-4 h-4"
                                            fill={recipe.isFavorite ? 'currentColor' : 'none'}
                                        />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="p-2 rounded-full backdrop-blur-sm bg-background/80 text-foreground hover:bg-background transition-colors">

                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-card border border-border">
                                            <DropdownMenuItem onClick={() => handleEdit(recipe.id)} className="cursor-pointer hover:bg-secondary/10">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(recipe.id)} className="cursor-pointer hover:bg-destructive/10 text-destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Difficulty Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getDifficultyColor(recipe.difficulty)}`}>
                                        {recipe.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 z-50">
                                <h3 className="text-lg font-bold text-card-foreground mb-2 line-clamp-1">
                                    {recipe.title}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                    {recipe.description}
                                </p>

                                {/* Recipe Meta Info */}
                                <div className="flex items-center gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{recipe.prepTime}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{recipe.servings} servings</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Link to={recipe.$id} className="flex-1 z-100">
                                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-poppins text-sm font-semibold  transition-colors cursor-pointer">
                                            View Recipe
                                        </Button>
                                    </Link>

                                    <Button className="z-100 p-2.5 border border-border hover:bg-secondary hover:text-secondary-foreground rounded-lg transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </Button>

                                    <Button className="z-100 p-2.5 border border-border hover:bg-secondary hover:text-accent-foreground rounded-lg transition-colors">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                        </WobbleCard>

                    ))}
                </div>

                {/* Empty State (shows when no recipes) */}
                {
                    recipes.length === 0 && (
                        <div className="text-center py-20">
                            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">No recipes yet</h3>
                            <p className="text-muted-foreground">Start creating your culinary masterpieces!</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Recipe;