import { useEffect, useState } from 'react';
import { Plus, Clock, Users, ChefHat, Sparkles, Edit2, Trash2, Search, Bookmark, Heart, Ellipsis, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/ui/SearchBar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../components/ui/dropdown-menu';
import { AIRequestError, callAI } from '../utils/aiHelper';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import Loader from '../components/Loader';
import { LoaderFiveLoader } from '../components/ui/LoaderButton';
import { Link, useNavigate } from 'react-router';
import { getAllRecipes } from '../appwrite/dbHelper';
import { DropdownMenuGroup, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
// import { MultiStepLoader } from '../components/ui/multi-step-loader';

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetchAllRecipes()
  }, [])

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    try {
      // Build prompt object to match API/server expectations
      const promptObj = {
        title,
        desc,
        servings: servings ? Number(servings) : undefined,
        difficulty,
      } as const;

      const result = await callAI(promptObj);
      // console.log(result);

      setError('');
      setLoading(false);
      navigate(`/recipe/${result.$id}`);
    } catch (err) {
      if (err instanceof AIRequestError) {
        setError(err.message);
        console.error('❌ Error:', err.message);
      } else {
        console.error('❌ Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchAllRecipes = async () => {
    const databaseId = import.meta.env.VITE_APPWRITE_DB_ID
    const recipeTableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID

    try {
      await getAllRecipes(databaseId, recipeTableId).then((res) => {
        const recipesData: Object = res.rows
        setRecipes(recipesData)
      })
    } catch (error) {

    }
  }
  const [recipes, setRecipes] = useState<Object>([]);



  const MotionButton = motion(Button);
  const buttonVariants = {
    hovered: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };
  const loadingStates = [
    {
      text: "Waking up the Chef",
    },
    {
      text: "Getting the ingredients",
    },
    {
      text: "He grinds the spices",
    },
    {
      text: "Cooking it up",
    },
    {
      text: "Plating the dish",
    },
    {
      text: "Almost done",
    },
    {
      text: "Just a moment more",
    },
    {
      text: "Ready to serve!",
    },
  ];

  return (
    <div className={`min-h-screen bg-background w-full  transition-all`}>
      {/* Header */}
      <header className="w-[76rem] m-auto border-b border-border bg-card rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">My Recipes</h1>
              <p className="text-muted-foreground mt-1">Create and manage your personalized recipes</p>
            </div>
            {/* <div className="flex items-center gap-3">
              <Button className="">
                <span className="">AI Assist</span>
                <span className="">
                  <Sparkles className="svg" />
                </span>
              </Button>
            </div> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Recipe Section */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-primary" />
                  Create New Recipe
                </h2>
                <p className="text-muted-foreground mt-1">Start crafting your next culinary masterpiece</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Recipe Name
                </Label>
                <Input
                  disabled={loading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="e.g., Grandma's Apple Pie"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </Label>
                <Textarea
                  disabled={loading}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Brief description of your recipe..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    Servings
                  </Label>
                  <Input
                  disabled={loading}
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    type="number"
                    placeholder="4"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty
                  </Label>
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button disabled={loading} className='' variant={'outline'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                        {difficulty || 'Select difficulty'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuRadioGroup value={difficulty} onValueChange={(val) => setDifficulty(val)}>
                        <DropdownMenuRadioItem value="easy">Easy</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="hard">Hard</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex gap-3 pt-2">

                <Button disabled={loading} onClick={handleTest} className={`px-7 py-6 bg-secondary text-secondary-foreground rounded-lg font-semibold text-xl hover:opacity-90 transition-opacity border border-border flex items-center gap-2 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
                  {loading ? (
                    <LoaderFiveLoader />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}

                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* My Recipes Section */}
        <section className='w-7xl'>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Your Recipes</h2>
              <p className="text-muted-foreground mt-1">{recipes.length} recipes in your collection</p>
            </div>
            <div className="relative">
              <SearchBar />
            </div>
          </div>


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

        </section>
      </main>
    </div>
  );
}