import React, { useEffect, useState } from 'react';
import { ChefHat, Home, BookOpen, Heart, Clock, Settings, Sparkles, User, LogOut, Search, Plus, Library, ForkKnifeCrossedIcon, Loader, SaveIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { getAllRecipes } from '../appwrite/dbHelper';
import { motion } from 'motion/react';
import { logout } from '../appwrite/auth';
import { toast } from 'sonner';
// import ThemeToggle from './ui/ThemeToggle';

export default function RecipeSidebar() {
  const [activeItem, setActiveItem] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recipes, setrecipes] = useState([])
  const [recipeLoading, setrecipeLoading] = useState(false)
  useEffect(() => {
    getRecipeTitle()
  }, [])
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logout().then(() => {
        toast.success("Succesfully Logged Out!")
        setTimeout(() => navigate('/login'), 3000)
      })
    } catch (error) {
      console.error("error logging out",error)
      throw error
    }
  }
  const getRecipeTitle = async () => {
    setrecipeLoading(true)
    const databaseId = import.meta.env.VITE_APPWRITE_DB_ID
    const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID
    try {
      await getAllRecipes(databaseId, recipeTableId).then((res) => {
        const recipesRow = res.rows
        setrecipes(recipesRow)
        setrecipeLoading(false)
      })
    } catch (error) {

    }
  }
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', badge: null, url: '/' },
    { id: 'recipes', icon: BookOpen, label: 'My Recipes', badge: null, url: '/recipes' },
    { id: 'explore', icon: Library, label: 'Explore', badge: '12', url: '/explore' },
    { id: 'saved_recipes', icon: SaveIcon, label: 'Saved Recipes', badge: '12', url: '/saved_recipes' },

  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings', url: '/settings' },

  ];

  
  return (
    <div
      className={`${isCollapsed ? 'w-20' : 'w-72'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">TaazaChef</h1>
                <p className="text-xs text-muted-foreground">Cook smarter</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-lg hover:bg-sidebar-accent transition-colors flex items-center justify-center"
            >
              <span className="text-sidebar-foreground text-lg">←</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsed toggle */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mx-auto mt-4 w-10 h-10 rounded-lg hover:bg-sidebar-accent transition-colors flex items-center justify-center"
        >
          <span className="text-sidebar-foreground text-lg">→</span>
        </button>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2.5 bg-sidebar-accent rounded-lg text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          const commonClass = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
            : 'text-sidebar-foreground hover:bg-sidebar-accent'
            } ${isCollapsed ? 'justify-center' : ''}`;

          const content = (
            <>
              <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-secondary' : ''} transition-transform group-hover:scale-110`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium text-sm text-ellipsis">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-ellipsis ${item.highlight
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-sidebar-accent text-sidebar-foreground'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </>
          );

          return item.url ? (
            <Link
              key={item.id}
              to={item.url}
              onClick={() => setActiveItem(item.id)}
              className={commonClass}
            >
              {content}
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={commonClass}
            >
              {content}
            </button>
          );
        })}

        {/* Quick Create Button */}
        {!isCollapsed && (
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            Quick Recipe
          </button>
        )}
        <div className='w-full flex flex-col items-start gap-4 mt-6 p-2'>
          <div>
            <Label className='text-zinc-600'>Your History</Label>
          </div>
          <div className='ml-2 w-full overflow-ellipsis'>
            {recipeLoading ? (
              <p><Loader className='animate-spin' /></p>
            ) : (
              <>
                {recipes.map((val) => (
                  <Link key={val.$id} to={`/recipe/${val.$id}`} className='text-ellipsis'>
                    <Button className='max-w-full flex items-start w-full font-semibold justify-start px-5' variant='outline'>
                      <ForkKnifeCrossedIcon />
                      <span className='-ellipsis'>{val.title}</span>
                    </Button>
                  </Link>
                ))}
              </>
            )}

          </div>
        </div>
      </nav>


      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link key={item.id} to={item.url}>

              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="flex-1 text-left text-sm font-medium">{item.label}</span>}
              </button>
            </Link>
          );
        })}

        {!isCollapsed && (
          <>

            <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all text-sm font-medium">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>

          </>
        )}
      </div>
    </div>
  );
}