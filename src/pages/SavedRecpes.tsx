import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Clock, Users, Bookmark, Heart, Trash2, Filter, SortAsc } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getAllSavedRecipes } from '@/appwrite/dbHelper';

// Sample saved recipes data
const [SavedRecipes, setsavedRecipes] = useState<Object>([])

const fetchSavedRecipes = async() => {
  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID
  const savedRecipesTabledId = import.meta.env.VITE_APPWRITE_SAVED_RECIPES_TABLED_ID
  try {
    await getAllSavedRecipes(databaseId,savedRecipesTabledId).then((res)=>{
      if (res.rows.length > 0) {
        const savedRecipes:Object = res.rows
        setsavedRecipes(savedRecipes)
      }
    })
  } catch (error) {
    
  }
}


const cuisines = ["All", "Italian", "Thai", "Japanese", "American", "French", "Mexican", "Greek"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

const SavedRecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [recipes, setRecipes] = useState(savedRecipes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;
      const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;

      return matchesSearch && matchesCuisine && matchesDifficulty;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.savedDate) - new Date(a.savedDate);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'time') return parseInt(a.cookTime) - parseInt(b.cookTime);
      return 0;
    });

    return filtered;
  }, [recipes, searchQuery, selectedCuisine, selectedDifficulty, sortBy]);

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      setRecipes(prev => prev.filter(r => r.id !== recipeToDelete.id));
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setSelectedDifficulty('All');
    setSortBy('recent');
  };

  const activeFiltersCount = [
    selectedCuisine !== 'All',
    selectedDifficulty !== 'All',
    sortBy !== 'recent'
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Bookmark className="w-8 h-8 text-primary fill-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">Saved Recipes</h1>
          </div>
          <p className="text-muted-foreground">Your personal collection of favorite recipes</p>
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
              placeholder="Search saved recipes..."
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
            {/* Cuisine Filter */}
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear filters ({activeFiltersCount})
                </Button>
              </motion.div>
            )}

            <div className="flex-1" />

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Saved</SelectItem>
                <SelectItem value="title">Name (A-Z)</SelectItem>
                <SelectItem value="time">Cook Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredRecipes.length}</span> saved {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        </motion.div>

        {/* Recipe Grid */}
        <AnimatePresence mode="popLayout">
          {filteredRecipes.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all group relative"
                  whileHover={{ y: -4 }}
                >
                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClick(recipe)}
                    className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
                  >
                    <Heart
                      className="w-5 h-5 fill-red-500 text-red-500 transition-colors"
                    />
                  </motion.button>

                  {/* Recipe Image */}
                  <div className="bg-muted h-48 flex items-center justify-center text-8xl border-b border-border relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img src="/Images/random_photos(1).jpg" alt="recipe image" />
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
                        <span>{recipe.cookTime}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 text-muted-foreground"
                      >
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings}</span>
                      </motion.div>
                      <div className="flex-1" />
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      {/* Action Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-80 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                          View Recipe
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={() => handleDeleteClick(recipe)} className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
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
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {recipes.length === 0 ? 'No saved recipes yet' : 'No recipes found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {recipes.length === 0
                  ? 'Start exploring and save your favorite recipes'
                  : 'Try adjusting your search or filters'}
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline" className="border-border">
                  Clear All Filters
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Remove saved recipe?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove "{recipeToDelete?.title}" from your saved recipes? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedRecipesPage;