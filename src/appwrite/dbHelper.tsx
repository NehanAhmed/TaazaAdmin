import { ID, Query } from "appwrite";
import { tablesDB } from "../lib/appwrite";


interface RecipeData {
    userId: string;
    title: string;
    description: string;
    serving: number;
    difficulty: string;
    aiResponse: string;
}
export const createRecipe = async (DatabaseId: string, TableId: string, data: RecipeData) => {
    try {

        const response = await tablesDB.createRow({
            databaseId: DatabaseId,
            tableId: TableId,
            rowId: ID.unique(),
            data: {
                "user_id": data.userId,
                "title": data.title,
                "description": data.description,
                "serving": data.serving,
                "difficulty": data.difficulty,
                "aiResponse": data.aiResponse
            }
        })
        if (response) {
            return response;
        }
        else {
            throw new Error("No response from Appwrite");
        }
    } catch (error) {
        console.error("Error creating recipe:", error);
        throw error;
    }
}

export const getRecipe = async (DatabaseId: string, TableId: string, RecipeId: string) => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DatabaseId,
            tableId: TableId,
            queries: [
                Query.equal("$id", RecipeId)
            ]
        })
        if (response) {
            return response;
        }
        else {
            throw new Error("No response from Appwrite");
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
};

export const getAllRecipes = async (DatabaseId: string, TableId: string) => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DatabaseId,
            tableId: TableId,
        })
        if (response) {
            return response;
        }
        else {
            throw new Error("No response from Appwrite");
        }
    } catch (error) {
        console.error("Error fetching all recipes:", error);
        throw error;
    }
}

export const deleteRecipe = async (DatabaseId: string, TableId: string, RecipeId: string) => {
    try {
        const response = await tablesDB.deleteRow({
            databaseId: DatabaseId,
            tableId: TableId,
            rowId: RecipeId
        })
        if (response) {
            return response;
        }
        else {
            throw new Error("No response from Appwrite");
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
}


export const getAllSavedRecipes = async (DatabaseId: string, TableId: string) => {
    try {
        const response = await tablesDB.listRows({
            databaseId: DatabaseId,
            tableId: TableId,
        })
        if (response) {
            return response
        }
        else {
            return "No Rows Found"
        }
    } catch (error) {
        console.error("Error Listing Saved Recipes.Try again", error)
        throw error
    }
}


export const insertASavedRecipe = async (DatabaseId: string, TableId: string, recipeId: string, userId: string) => {
    try {
        const response = await tablesDB.createRow({
            databaseId: DatabaseId,
            tableId: TableId,
            rowId: ID.unique(),
            data: {
                "user_id": userId,
                "recipe_id": recipeId
            }
        })
        if (response) {
            return response;
        } else {
            throw new Error("No response from Appwrite");
        }
    } catch (error) {
        console.error("Error inserting saved recipe:", error);
        throw error;
    }
}