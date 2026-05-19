// services/claude.service.ts
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import dotenv from "dotenv";
dotenv.config();

// ─── Configuración de keys y modelos con fallback ───────────────────────────

const API_KEYS = [
  { name: process.env.DEV1_NAME || "Cristian", apiKey: process.env.OPENROUTER_API_KEY_1 || "" },
  { name: process.env.DEV2_NAME || "Luis", apiKey: process.env.OPENROUTER_API_KEY_2 || "" },
  { name: process.env.DEV3_NAME || "Eunice", apiKey: process.env.OPENROUTER_API_KEY_3 || "" },
  { name: process.env.DEV4_NAME || "Tania", apiKey: process.env.OPENROUTER_API_KEY_4 || "" },
  { name: process.env.DEV5_NAME || "Katherine", apiKey: process.env.OPENROUTER_API_KEY_5 || "" },
].filter((k) => k.apiKey !== "");

const MODELS = (
  process.env.AI_MODELS ||
  "meta-llama/llama-3.1-8b-instruct:free,deepseek/deepseek-r1-0528:free,google/gemini-2.0-flash-exp:free"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

// Log de diagnóstico al arrancar
console.log("🔧 Keys cargadas:");
API_KEYS.forEach((k) => console.log(`  ✅ [${k.name}]`));
console.log(`📦 Modelos: ${MODELS.join(", ")}`);

// Códigos HTTP que indican rate limit o sin tokens
const RATE_LIMIT_CODES = [429, 402, 503];

class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

// ─── Función core con fallback automático ───────────────────────────────────

async function callWithFallback(
  messages: ChatCompletionMessageParam[]
): Promise<string> {
  const errors: string[] = [];

  for (const keyConfig of API_KEYS) {
    for (const model of MODELS) {
      try {
        console.log(`🔑 Intentando con [${keyConfig.name}] + [${model}]...`);

        const client = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: keyConfig.apiKey,
        });

        const response = await client.chat.completions.create({
          model,
          messages,
          max_tokens: 4000,
        });

        // Verificar error embebido (OpenRouter a veces responde 200 con error dentro)
        const raw = response as any;
        if (raw?.error) {
          const code = raw.error.code || raw.error.status;
          if (RATE_LIMIT_CODES.includes(Number(code))) {
            throw new RateLimitError(`Sin tokens: ${raw.error.message}`);
          }
          throw new Error(`Error API: ${raw.error.message}`);
        }

        const result = response.choices[0].message.content || "";
        const cleanResult = result
          .replace(/^```html\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();

        console.log(`✅ Éxito con [${keyConfig.name}] + [${model}]`);
        console.log(`📄 Primeros 200 chars:`, cleanResult.substring(0, 200));
        console.log(`📏 Longitud total: ${cleanResult.length} chars`);
        return cleanResult;

      } catch (error) {
        const msg = `[${keyConfig.name}][${model}]: ${(error as Error).message}`;
        errors.push(msg);
        console.warn(`⚠️  ${msg}`);
        continue;
      }
    }
  }

  throw new Error(`❌ Todos los modelos y keys fallaron:\n${errors.join("\n")}`);
}

// ─── Style guides ────────────────────────────────────────────────────────────

const styleGuides: Record<string, string> = {
  moderno: `
    ESTILO: Moderno
    - Colores: azul (#2563EB) como color principal, fondo blanco, texto oscuro (#1E293B)
    - Tipografía: sans-serif moderna (Arial o Inter)
    - Layout: sidebar izquierdo con foto y datos de contacto, contenido principal a la derecha
    - Encabezado con banda de color azul con nombre y título en blanco
    - Secciones con línea divisora azul y títulos en mayúsculas
    - Íconos simples con bullets de color azul
  `,
  clasico: `
    ESTILO: Clásico
    - Colores: negro y gris oscuro (#1E293B, #475569), fondo blanco puro
    - Tipografía: serif (Georgia o Times New Roman)
    - Layout: una sola columna centrada, encabezado con nombre grande centrado
    - Líneas horizontales simples para separar secciones
    - Títulos de sección en versalitas y negrita
    - Aspecto formal y tradicional, como un CV ejecutivo
  `,
  minimalista: `
    ESTILO: Minimalista
    - Colores: solo negro, grises suaves y blanco. Sin colores de acento
    - Tipografía: sans-serif ligera (Helvetica o Arial Light)
    - Layout: una columna, mucho espacio en blanco, márgenes generosos
    - Sin bordes ni líneas llamativas, solo espaciado para separar secciones
    - Nombre en tamaño grande, resto del contenido pequeño y limpio
    - Aspecto ultra limpio y moderno estilo nórdico
  `,
  creativo: `
    ESTILO: Creativo
    - Colores: púrpura (#7C3AED) y rosa (#EC4899) como acentos, fondo cálido (#FFF7ED)
    - Tipografía: mezcla de sans-serif para títulos y normal para cuerpo
    - Layout: dos columnas con sidebar colorido a la izquierda
    - Sidebar con fondo degradado de púrpura a rosa, texto blanco
    - Secciones con badges de color para habilidades y herramientas
    - Encabezado llamativo con nombre grande y título con color de acento
  `,
};

// ─── Funciones públicas ──────────────────────────────────────────────────────

export async function generateCV(formData: any, style: string = "moderno"): Promise<string> {
  const styleGuide = styleGuides[style] || styleGuides.moderno;

  const prompt = `Eres un experto diseñador de CVs. Genera un CV profesional y visualmente atractivo en HTML + CSS completo.

DATOS DEL USUARIO:
${JSON.stringify(formData, null, 2)}

GUÍA DE ESTILO A SEGUIR OBLIGATORIAMENTE:
${styleGuide}

INSTRUCCIONES TÉCNICAS:
- Devuelve SOLO el código HTML completo, sin explicaciones ni bloques markdown
- Todo el CSS debe estar dentro de una etiqueta <style> en el <head>
- El diseño debe verse exactamente como el estilo indicado
- Usa unidades em y rem para tipografía, px para espaciados
- El CV debe tener formato A4 (794px de ancho máximo)
- Incluye todas las secciones: encabezado, resumen, experiencia, educación, habilidades, herramientas, idiomas
- El resultado debe verse como un CV real listo para imprimir o exportar a PDF
- NO uses imágenes externas ni fuentes de Google Fonts, solo fuentes del sistema`;

  return callWithFallback([{ role: "user" as const, content: prompt }]);
}

export async function editCV(currentHTML: string, userPrompt: string): Promise<string> {
  const prompt = `Eres un experto diseñador de CVs. El usuario quiere modificar su CV en HTML.

CV ACTUAL:
${currentHTML}

INSTRUCCIÓN DEL USUARIO:
${userPrompt}

INSTRUCCIONES:
- Devuelve SOLO el HTML modificado completo, sin explicaciones ni bloques markdown
- Aplica exactamente lo que pide el usuario (colores, tipografía, layout, secciones, etc)
- Mantén todos los datos del CV intactos, solo cambia lo que se indica
- El resultado debe ser HTML válido y completo`;

  return callWithFallback([{ role: "user" as const, content: prompt }]);
}