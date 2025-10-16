import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Users, TrendingUp, Heart, Share2, Bookmark, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { WobbleCard } from '../components/ui/wobble-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { getAllRecipes } from '../appwrite/dbHelper';
import { th } from 'zod/v4/locales';
import RecipeCard from '../components/ui/RecipeCard';
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
    const [recipes, setRecipes] = useState([
        {
            title: 'pehla title',
            desc: 'faltu desc ha ya',
            time: "2min",
            serving: "2",
            difficulty: "easy"
        },
        {
            title: 'pehla title',
            desc: 'faltu desc ha ya',
            time: "2min",
            serving: "2",
            difficulty: "easy"
        }
        ,
        {
            title: 'pehla title',
            desc: 'faltu desc ha ya',
            time: "2min",
            serving: "2",
            difficulty: "easy"
        }
        ,
    ]);


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
                    <RecipeCard data={recipes} />
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