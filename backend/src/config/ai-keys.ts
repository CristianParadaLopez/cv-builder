// config/ai-keys.ts
import dotenv from "dotenv";
dotenv.config();

export const AI_KEYS = [
  { name: "Luis",     apiKey: process.env.OPENROUTER_API_KEY_2 || "" },
  { name: "Eunice",   apiKey: process.env.OPENROUTER_API_KEY_3 || "" },
  { name: "Tania",    apiKey: process.env.OPENROUTER_API_KEY_4 || "" },
  { name: "Cristian", apiKey: process.env.OPENROUTER_API_KEY_1 || "" },
].filter((k) => k.apiKey !== "");

export const AI_MODELS = (process.env.AI_MODELS || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);