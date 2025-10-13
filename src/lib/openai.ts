import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": import.meta.env.VITE_APP_URL,
    "X-Title": import.meta.env.VITE_APP_TITLE,
  },
});

