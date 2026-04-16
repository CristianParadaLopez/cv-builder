import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const MODEL = process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
// definimos el modelo de IA en una constante que estamos usando para generar y editar los CVs. 
// Se puede configurar mediante la variable de entorno AI_MODEL, nosotros podemos cambiar el modelo actualizacion el archivo .env

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

export async function generateCV(formData: any, style: string = "moderno"): Promise<string> {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  // obtenemos la guía de estilo correspondiente al estilo seleccionado por el usuario, si no se encuentra el estilo se usa el estilo moderno por defecto

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

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
  });

  return response.choices[0].message.content || "";
}

export async function editCV(currentHTML: string, userPrompt: string): Promise<string> {
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  // este método recibe el HTML actual del CV y una instrucción del usuario sobre qué cambios quiere hacer.
  //  El prompt le indica a la IA que solo devuelva el HTML modificado completo, sin explicaciones ni bloques markdown, y que mantenga todos los datos del CV intactos, solo cambiando lo que se indica en la instrucción del usuario.

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

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
  });
  // la respuesta de la IA es el HTML completo del CV con las modificaciones solicitadas por el usuario, este HTML se envía al frontend para actualizar la vista previa del CV.

  return response.choices[0].message.content || "";
}