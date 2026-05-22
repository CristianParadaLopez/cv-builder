// lib/openrouter-client.ts
import { AI_KEYS, AI_MODELS } from "../config/ai-keys";

interface OpenRouterResponse {
  choices: { message: { content: string } }[];
  error?: { code: number; message: string };
}

// Errores que indican que se agotaron los tokens/límite
const RATE_LIMIT_ERRORS = [429, 402, 503];

async function callWithKey(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  const data: OpenRouterResponse = await response.json();

  // Si hay error de límite, lanzamos para activar el fallback
  if (!response.ok || data.error) {
    const errorCode = data.error?.code || response.status;
    if (RATE_LIMIT_ERRORS.includes(errorCode)) {
      throw new RateLimitError(`Key agotada (${errorCode}): ${data.error?.message}`);
    }
    throw new Error(`Error API: ${data.error?.message}`);
  }

  return data.choices[0].message.content;
}

// Error custom para distinguir "sin tokens" de otros errores
class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

// Función principal con fallback automático
export async function generateWithFallback(
  messages: { role: string; content: string }[]
): Promise<{ result: string; usedKey: string; usedModel: string }> {
  const errors: string[] = [];

  for (const keyConfig of AI_KEYS) {
    for (const model of AI_MODELS) {
      try {
        console.log(`Intentando con ${keyConfig.name} + ${model}...`);
        const result = await callWithKey(keyConfig.apiKey, model, messages);

        return {
          result,
          usedKey: keyConfig.name,
          usedModel: model,
        };
      } catch (error) {
        const msg = `[${keyConfig.name}][${model}]: ${(error as Error).message}`;
        errors.push(msg);
        console.warn(msg);

        // Si NO es rate limit, no tiene sentido probar otro modelo con la misma key
        if (!(error instanceof RateLimitError)) break;
      }
    }
  }

  throw new Error(`Todos los modelos fallaron:\n${errors.join("\n")}`);
}