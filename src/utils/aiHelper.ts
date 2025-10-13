// utils/aiHelper.ts

import { createRecipe } from "../appwrite/dbHelper";
import { getUserDetails } from "../hooks/getUserDetails";

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AIError {
  error: string;
  details?: string;
  message?: string;
}

interface AIHelperOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (status: string) => void;
}

class AIRequestError extends Error {
  public statusCode?: number
  public details?: string

  constructor(message: string, statusCode?: number, details?: string) {
    super(message);
    this.name = "AIRequestError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Sanitizes and validates the prompt before sending
 */
function sanitizePrompt(prompt: string): string {
  if (typeof prompt !== "string") {
    throw new AIRequestError("Prompt must be a string");
  }

  const sanitized = prompt.trim();

  if (sanitized.length === 0) {
    throw new AIRequestError("Prompt cannot be empty");
  }

  if (sanitized.length > 10000) {
    throw new AIRequestError("Prompt exceeds maximum length of 10,000 characters");
  }

  // Remove any potentially harmful characters or scripts
  const cleaned = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  return cleaned;
}

async function getUserId(): Promise<string | undefined> {
  try {
    const details = await getUserDetails();
    if (!details) {
      return undefined;
    }
    return details.$id;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return undefined;
  }
}
/**
 * Makes a request to the AI API with retry logic
 */
async function makeAIRequest(
  prompt: string,
  retryCount: number = 0,
  maxRetries: number = 2
): Promise<AIResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different status codes
    if (!response.ok) {
      const errorData: AIError = await response.json().catch(() => ({
        error: "Unknown error",
      }));

      // Retry on server errors (5xx) but not client errors (4xx)
      if (response.status >= 500 && retryCount < maxRetries) {
        console.warn(`Request failed with ${response.status}, retrying... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return makeAIRequest(prompt, retryCount + 1, maxRetries);
      }

      throw new AIRequestError(
        errorData.error || "Request failed",
        response.status,
        errorData.details || errorData.message
      );
    }

    const data: AIResponse = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new AIRequestError("Invalid response structure from API");
    }
  

    return data;
  } catch (error) {
    if (error instanceof AIRequestError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new AIRequestError("Request timeout - please try again");
      }
      throw new AIRequestError(`Network error: ${error.message}`);
    }

    throw new AIRequestError("An unexpected error occurred");
  }
}
interface RecipeData {
  userId: string;
  title: string;
  description: string;
  serving: number;
  difficulty: string;
  aiResponse: string;
}
async function createRecipeInDB(
  databaseId: string,
  tableId: string,
  data: RecipeData
) {
  try {
    await createRecipe(databaseId, tableId, data)
  } catch (error) {
    console.error("Error creating recipe in DB:", error);
    throw error;
  }
}

/**
 * Main helper function to interact with AI API
 * @param prompt - The prompt to send to the AI
 * @param options - Optional configuration
 * @returns The AI response text
 */
export async function callAI(
  prompt: object | string,
  options: AIHelperOptions = {}
): Promise<string> {
  const { retries = 2, onProgress } = options;

  try {
    // Step 1: Sanitize input
    onProgress?.("Validating input...");
    // If the caller provided an object, build a detailed prompt string similar to the server-side
    let promptString: string;
    if (typeof prompt === "string") {
      promptString = prompt;
    } else if (typeof prompt === "object" && prompt !== null) {
      const p: any = prompt;
      const title = p.title || "Untitled Recipe";
      const desc = p.desc || "No description provided";
      const servings = p.servings ?? "Any";
      const difficulty = p.difficulty || "Medium";

      promptString = `\nYou are a MasterChef AI. Create a detailed recipe based on the following user input:\n\nTitle: ${title}\nDescription: ${desc}\nServings: ${servings}\nDifficulty: ${difficulty}\n\nProvide a complete recipe including:\n- Title\n- Short description\n- Ingredients (with measurements)\n- Step-by-step instructions\n- Optional tips or variations\n`.trim();
    } else {
      throw new AIRequestError("Invalid prompt format");
    }

    const sanitizedPrompt = sanitizePrompt(promptString);

    // Step 2: Make API request
    onProgress?.("Sending request to AI...");
    const response = await makeAIRequest(sanitizedPrompt, 0, retries);

    // Step 3: Extract and return the content
    onProgress?.("Processing response...");
    const content = response.choices[0].message.content;

    if (!content || typeof content !== "string") {
      throw new AIRequestError("Invalid content in response");
    }
    const userPrompt = prompt
    const aiResponse = content
    const databaseId = import.meta.env.VITE_APPWRITE_DB_ID || "";
    const tableId = import.meta.env.VITE_APPWRITE_RECIPES_TABLE_ID || "";
   
    const userId = await getUserId();
    if (!userId) throw new AIRequestError("User ID not found");
    const data = {
      userId,
      title: userPrompt.title || "Untitled Recipe",
      description: userPrompt.description || "No description provided",
      serving: userPrompt.serving || 1,
      difficulty: userPrompt.difficulty || "Medium",
      aiResponse: aiResponse
    }
    await createRecipeInDB(databaseId, tableId, data)
    onProgress?.("Complete");
    return content;
  } catch (error) {
    if (error instanceof AIRequestError) {
      throw error;
    }
    throw new AIRequestError("Failed to process AI request");
  }
}

/**
 * Advanced helper with full response details
 * Use this when you need access to tokens, finish_reason, etc.
 */
export async function callAIAdvanced(
  prompt: string,
  options: AIHelperOptions = {}
): Promise<AIResponse> {
  const { retries = 2, onProgress } = options;

  onProgress?.("Validating input...");
  const sanitizedPrompt = sanitizePrompt(prompt);

  onProgress?.("Sending request to AI...");
  const response = await makeAIRequest(sanitizedPrompt, 0, retries);

  onProgress?.("Complete");
  return response;
}

/**
 * Batch processing helper for multiple prompts
 */
export async function callAIBatch(
  prompts: string[],
  options: AIHelperOptions = {}
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < prompts.length; i++) {
    options.onProgress?.(`Processing prompt ${i + 1}/${prompts.length}`);
    const result = await callAI(prompts[i], options);
    results.push(result);
  }

  return results;
}

// Export the error class for type checking
export { AIRequestError };
export type { AIResponse, AIError, AIHelperOptions };