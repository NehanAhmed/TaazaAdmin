import React, { useState } from 'react';
import { Button } from './button';
import { Bookmark, Clock, Ellipsis, Eye, Heart, Loader, Trash, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { deleteRecipe } from '../../appwrite/dbHelper';
import { motion } from "motion/react"
export const RecipeCard = ({ recipes = [] ,Loading}) => { 
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(Loading)
  const handleDelete = async (id) => {
    const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
    const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID;
    try {
      await deleteRecipe(databaseId, recipeTableId, id);
      toast.success('Recipe deleted');
      setTimeout(() => navigate('/recipes'), 2000); DropdownMenuGroup
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return <p className="text-muted-foreground">No recipes found.</p>;
  }

  return (
    
    <div className='w-7xl'>
      {isLoading &&  (
        <EmptyState />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.$id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all group relative"
            whileHover={{ y: -4 }}
          >
            {/* Favorite Button */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(recipe.$id)}
                  className="absolute top-3 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
                >
                  <Ellipsis
                    className={`w-5 h-5 transition-colors 
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground'
                        }`}
                  />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleDelete(res.$id || res.id)}
                    className="flex justify-between text-destructive cursor-pointer"
                  >
                    <span>Delete Recipe</span>
                    <Trash className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem

                    className="text-center flex justify-between  cursor-pointer"
                  >
                    <span>Bookmark</span>
                    <Bookmark className="w-4 h-4" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(recipe.$id)}
              className="absolute top-3 right-14 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors 
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

              <div className='w-full  flex gap-2'>

                {/* Action Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to={`/recipe/${recipe.$id}`}>

                    <Button className="font-semibold w-80 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                      View Recipe
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    <Bookmark />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
const EmptyState = () => {
  return (
    <div>
      <Loader  />
    </div>
  )
}
export default RecipeCard;
