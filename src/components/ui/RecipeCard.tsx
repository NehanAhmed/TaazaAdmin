import React from 'react';
import { Button } from './button';
import { Bookmark, Clock, Ellipsis, Eye, Heart, Trash, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { deleteRecipe } from '../../appwrite/dbHelper';

export const RecipeCard = ({ recipeData = [] }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
    const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID;
    try {
      await deleteRecipe(databaseId, recipeTableId, id);
      toast.success('Recipe deleted');
      setTimeout(() => navigate('/recipes'), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  if (!Array.isArray(recipeData) || recipeData.length === 0) {
    return <p className="text-muted-foreground">No recipes found.</p>;
  }

  return (
    <>
      {recipeData.map((res) => (
        <div key={res.$id || res.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
          <div className="w-full flex justify-end p-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon">
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
          </div>

          <div className="bg-muted h-48 flex items-center justify-center text-6xl border-b border-border">
            😆
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {res.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{res.description}</p>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{res.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{res.serving}</span>
              </div>
              <div className="flex-1" />
              <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {res.difficulty}
              </span>
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
                <Link to={`/recipe/${res.$id}`}> 
                
              <Button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                View Recipe
              </Button>
                </Link>
              <Button className="px-4 py-2 text-destructive rounded-lg font-medium transition-colors text-sm" variant="outline">
                <Heart className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RecipeCard;
