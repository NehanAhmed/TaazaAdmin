import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Clock, Users, ChefHat, Flame, Heart, Filter, SlidersHorizontal, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { getAllRecipes, insertASavedRecipe } from '../appwrite/dbHelper';
import { Link } from 'react-router';

// Sample recipe data
const recipes = [
    {
        id: 1,
        title: "Classic Margherita Pizza",
        description: "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil leaves on a crispy thin crust.",
        image: "🍕",
        cookTime: "25 min",
        servings: "4 servings",
        difficulty: "Easy",
        category: "Italian",
        cuisine: "Italian",
        calories: 280
    },
    {
        id: 2,
        title: "Spicy Thai Green Curry",
        description: "Aromatic green curry with coconut milk, vegetables, and your choice of protein.",
        image: "🍛",
        cookTime: "40 min",
        servings: "4 servings",
        difficulty: "Medium",
        category: "Main Course",
        cuisine: "Thai",
        calories: 420
    },
    {
        id: 3,
        title: "Chocolate Lava Cake",
        description: "Decadent molten chocolate cake with a gooey center, served warm with vanilla ice cream.",
        image: "🍰",
        cookTime: "20 min",
        servings: "2 servings",
        difficulty: "Hard",
        category: "Dessert",
        cuisine: "French",
        calories: 520
    },
    {
        id: 4,
        title: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing.",
        image: "🥗",
        cookTime: "15 min",
        servings: "2 servings",
        difficulty: "Easy",
        category: "Salad",
        cuisine: "American",
        calories: 180
    },
    {
        id: 5,
        title: "Sushi Roll Platter",
        description: "Assorted fresh sushi rolls with salmon, tuna, and avocado, served with wasabi and soy sauce.",
        image: "🍣",
        cookTime: "45 min",
        servings: "3 servings",
        difficulty: "Hard",
        category: "Japanese",
        cuisine: "Japanese",
        calories: 350
    },
    {
        id: 6,
        title: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, cheese, and special sauce on a toasted bun.",
        image: "🍔",
        cookTime: "30 min",
        servings: "4 servings",
        difficulty: "Easy",
        category: "Fast Food",
        cuisine: "American",
        calories: 550
    },
    {
        id: 7,
        title: "Pad Thai Noodles",
        description: "Stir-fried rice noodles with shrimp, peanuts, egg, and tangy tamarind sauce.",
        image: "🍜",
        cookTime: "35 min",
        servings: "3 servings",
        difficulty: "Medium",
        category: "Main Course",
        cuisine: "Thai",
        calories: 480
    },
    {
        id: 8,
        title: "Chicken Tacos",
        description: "Soft tacos filled with seasoned chicken, fresh salsa, and creamy guacamole.",
        image: "🌮",
        cookTime: "25 min",
        servings: "4 servings",
        difficulty: "Easy",
        category: "Mexican",
        cuisine: "Mexican",
        calories: 320
    },
    {
        id: 9,
        title: "Greek Moussaka",
        description: "Layered eggplant casserole with spiced meat sauce and creamy béchamel topping.",
        image: "🍆",
        cookTime: "90 min",
        servings: "6 servings",
        difficulty: "Hard",
        category: "Main Course",
        cuisine: "Greek",
        calories: 450
    }
];
interface Recipe {
    $id: number;
    user_id: string
    title: string;
    description: string;
    serving: number
    difficulty: string
    aiResponse: string
}

const categories = ["All", "Italian", "Thai", "Japanese", "American", "Mexican", "Greek", "French"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const cuisines = ["All", "Italian", "Thai", "Japanese", "American", "Mexican", "Greek", "French"];

const RecipeExplorePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [sortBy, setSortBy] = useState('title');
    const [favorites, setFavorites] = useState(new Set());


    const [Recipes, setRecipes] = useState<Recipe[]>([]);
    useEffect(() => {
        fetchAllRecipes()
    }, [])
    const handleSaveRecipe = async(id) => {
        const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
        const savedRecipesTabledId = import.meta.env.VITE_APPWRITE_SAVED_RECIPES_TABLE_ID;
        const userId = localStorage.getItem("user_id");
        const recipeId = id;
        try {
            await insertASavedRecipe(databaseId,savedRecipesTabledId,userId,recipeId)
        } catch (error) {
            
        }
    }
    const fetchAllRecipes = async () => {
        const databaseId = import.meta.env.VITE_APPWRITE_DB_ID
        const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID

        try {
            await getAllRecipes(databaseId, recipeTableId).then((res) => {
                const recipesData = res.rows;
                console.log(recipesData);

                setRecipes(recipesData as unknown as Recipe[])
            })
        } catch (error) {

        }
    }
    // Filter and sort recipes
    const filteredRecipes = useMemo(() => {
        let filtered = recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory || recipe.cuisine === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
            const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;

            return matchesSearch && matchesCategory && matchesDifficulty && matchesCuisine;
        });

        // Sort recipes
        filtered.sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'time') return parseInt(a.cookTime) - parseInt(b.cookTime);
            if (sortBy === 'difficulty') {
                const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            }
            return 0;
        });

        return filtered;
    }, [searchQuery, selectedCategory, selectedDifficulty, selectedCuisine, sortBy]);

    const toggleFavorite = (id) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(id)) {
                newFavorites.delete(id);
            } else {
                newFavorites.add(id);
            }
            return newFavorites;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedDifficulty('All');
        setSelectedCuisine('All');
        setSortBy('title');
    };

    const activeFiltersCount = [
        selectedCategory !== 'All',
        selectedDifficulty !== 'All',
        selectedCuisine !== 'All',
        sortBy !== 'title'
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <ChefHat className="w-8 h-8 text-primary" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-foreground">Recipe Library</h1>
                    </div>
                    <p className="text-muted-foreground">Discover and explore delicious recipes from around the world</p>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 space-y-4"
                >
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search recipes by name or ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Quick Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 5).map((category) => (
                                <motion.button
                                    key={category}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-card text-foreground border border-border hover:border-primary/50'
                                        }`}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex-1" />

                        {/* Sort Dropdown */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px] bg-card border-border">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Name (A-Z)</SelectItem>
                                <SelectItem value="time">Cook Time</SelectItem>
                                <SelectItem value="difficulty">Difficulty</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Advanced Filters Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="relative border-border">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <Badge className="ml-2 bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-background border-border">
                                <SheetHeader>
                                    <SheetTitle className="text-foreground">Advanced Filters</SheetTitle>
                                    <SheetDescription className="text-muted-foreground">
                                        Refine your recipe search with detailed filters
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="p-4 mt-6 space-y-6">
                                    {/* Difficulty Filter */}
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Difficulty Level
                                        </label>
                                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                            <SelectTrigger className="bg-card border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {difficulties.map((diff) => (
                                                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Cuisine Filter */}
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Cuisine Type
                                        </label>
                                        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                                            <SelectTrigger className="bg-card border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cuisines.map((cuisine) => (
                                                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Clear Filters Button */}
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="w-full border-border"
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 flex items-center justify-between"
                >
                    <p className="text-sm text-muted-foreground">
                        Found <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
                    </p>
                </motion.div>

                {/* Recipe Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredRecipes.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {Recipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe.$id}
                                  
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all group relative"
                                    whileHover={{ y: -4 }}
                                >
                                    {/* Favorite Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleFavorite(recipe.$id)}
                                        className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-colors ${favorites.has(recipe.$id)
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-muted-foreground'
                                                }`}
                                        />
                                    </motion.button>

                                    {/* Recipe Image */}
                                    <div className="bg-muted h-48 flex items-center justify-center text-8xl border-b border-border relative overflow-hidden">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img src="/Images/random_photos(1).jpg" alt="image of rendom thing" />
                                        </motion.div>
                                    </div>

                                    {/* Recipe Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            {recipe.description}
                                        </p>

                                        {/* Recipe Meta */}
                                        <div className="flex items-center gap-4 mb-4 text-sm">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="flex items-center gap-1.5 text-muted-foreground"
                                            >
                                                <Clock className="w-4 h-4" />
                                                <span>1min</span>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="flex items-center gap-1.5 text-muted-foreground"
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>{recipe.serving}</span>
                                            </motion.div>
                                            <div className="flex-1" />
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                                {recipe.difficulty}
                                            </span>
                                        </div>

                                        <div className='flex gap-2'>

                                            {/* Action Button */}
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Link to={`/recipe/${recipe.$id}`}>
                                                
                                                <Button className="w-80 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                                                    View Recipe
                                                </Button>
                                                </Link>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button onClick={handleSaveRecipe(recipe.$id)} className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                                                    <Bookmark />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your search or filters
                            </p>
                            <Button onClick={clearFilters} variant="outline" className="border-border">
                                Clear All Filters
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default RecipeExplorePage