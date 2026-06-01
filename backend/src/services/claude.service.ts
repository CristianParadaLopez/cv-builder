// backend/src/services/claude.service.ts
// CORREGIDO:
// - styleGuides expandidos con instrucciones visuales detalladas por plantilla
// - ATS genera CV tipo imagen 1 (Francisco Mercado — una columna, blanco/negro)
// - clasico genera tipo imagen 4 (Richard Sanchez — franja azul, dos columnas)
// - creativo genera combinacion imagen 2 + imagen 3 (sidebar verde, foto, badges)
// - moderno mantiene sidebar azul profesional
// - minimalista: una columna, sans-serif ligera, mucho espacio
// - Photo injection mantenida, sin enviar base64 a la IA

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import dotenv from "dotenv";

dotenv.config();

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────

const API_KEYS = [

  { name: process.env.DEV2_NAME || "Luis",     apiKey: process.env.OPENROUTER_API_KEY_2 || "" },
  { name: process.env.DEV3_NAME || "Eunice",   apiKey: process.env.OPENROUTER_API_KEY_3 || "" },
  { name: process.env.DEV4_NAME || "Tania",    apiKey: process.env.OPENROUTER_API_KEY_4 || "" },
  { name: process.env.DEV5_NAME || "Katherine",apiKey: process.env.OPENROUTER_API_KEY_5 || "" },
  { name: process.env.DEV1_NAME || "Cristian", apiKey: process.env.OPENROUTER_API_KEY_1 || "" },
].filter((k) => k.apiKey !== "");

const MODELS = (
  process.env.AI_MODELS ||
  "meta-llama/llama-3.1-8b-instruct:free,deepseek/deepseek-r1-0528:free,google/gemini-2.0-flash-exp:free"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

console.log("🔧 Keys cargadas:");
API_KEYS.forEach((k) => console.log(`✅ ${k.name}`));
console.log("📦 Modelos:");
MODELS.forEach((m) => console.log(`→ ${m}`));

const RATE_LIMIT_CODES = [429, 402, 503];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function extractHTML(raw: string): string {
  let cleaned = raw
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstDoctype = cleaned.indexOf("<!DOCTYPE");
  const firstHtml = cleaned.toLowerCase().indexOf("<html");
  const start =
    firstDoctype !== -1 ? firstDoctype : firstHtml !== -1 ? firstHtml : 0;

  return cleaned.slice(start).trim();
}

function extractText(raw: string): string {
  return raw
    .replace(/^```(?:\w+)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function stripPhoto(formData: any): { cleanData: any; photoBase64: string | null } {
  const { photo, ...cleanData } = formData;
  return {
    cleanData,
    photoBase64: photo && typeof photo === "string" && photo.startsWith("data:") ? photo : null,
  };
}

function injectPhoto(html: string, photoBase64: string): string {
  return html.replace(/src=["']PHOTO_PLACEHOLDER["']/gi, `src="${photoBase64}"`);
}

// ─────────────────────────────────────────────────────────────
// FALLBACK SYSTEM
// ─────────────────────────────────────────────────────────────

async function callWithFallback(messages: ChatCompletionMessageParam[]): Promise<string> {
  const errors: string[] = [];

  for (const keyConfig of API_KEYS) {
    for (const model of MODELS) {
      try {
        console.log(`🔑 Intentando con [${keyConfig.name}] + [${model}]`);

        const client = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: keyConfig.apiKey,
        });

        const response = await client.chat.completions.create({
          model,
          messages,
          max_tokens: 4000,
        });

        const raw = response as any;

        if (raw?.error) {
          const code = raw.error.code || raw.error.status;
          if (RATE_LIMIT_CODES.includes(Number(code))) {
            throw new Error(`Sin tokens: ${raw.error.message}`);
          }
          throw new Error(raw.error.message);
        }

        const result = response.choices?.[0]?.message?.content || "";
        if (!result || result.trim().length < 100) {
          throw new Error("Respuesta vacía o muy corta del modelo");
        }

        console.log(`✅ Éxito con [${keyConfig.name}] + [${model}]`);
        return result;
      } catch (error) {
        const msg = `[${keyConfig.name}] [${model}] → ${(error as Error).message}`;
        console.warn("⚠️", msg);
        errors.push(msg);
        continue;
      }
    }
  }

  throw new Error(`❌ Todos los modelos fallaron:\n${errors.join("\n")}`);
}

// ─────────────────────────────────────────────────────────────
// STYLE GUIDES — DETALLADOS POR PLANTILLA
// ─────────────────────────────────────────────────────────────

const styleGuides: Record<string, string> = {

  // ── MODERNO: Sidebar izquierda azul, columna derecha blanca ──
  moderno: `
ESTILO: Moderno Profesional

ESTRUCTURA HTML REQUERIDA:
- body: margin 0, font-family Arial/Helvetica sans-serif, background #fff
- Contenedor principal: display flex, flex-direction row, min-height 100%
- COLUMNA IZQUIERDA (sidebar): width 30%, background #1E293B, color #fff, padding 28px 20px
  * Si hay foto: img circular 100px con border 3px solid #2563EB
  * Nombre completo (font-size 16px, font-weight 700, color #fff, margin-top 12px)
  * Cargo (font-size 11px, color #93C5FD, margin-bottom 16px)
  * Secciones en sidebar: CONTACTO, HABILIDADES, HERRAMIENTAS, IDIOMAS
  * Títulos de sección sidebar: font-size 10px, letter-spacing 1.5px, color #93C5FD, text-transform uppercase, margin-bottom 8px
  * Items de contacto: font-size 11px, color #CBD5E1, margin-bottom 6px
  * Skills: cada skill en un badge, background rgba(37,99,235,0.3), border-radius 4px, padding 3px 8px, font-size 10px, color #BFDBFE, margin 2px
- COLUMNA DERECHA: flex 1, padding 32px 28px, background #fff
  * Header top: nombre (font-size 26px, font-weight 800, color #1E293B), cargo (font-size 14px, color #2563EB)
  * Línea separadora: border-bottom 2px solid #2563EB, margin-bottom 16px
  * Secciones: RESUMEN, EXPERIENCIA, EDUCACIÓN, CERTIFICACIONES, PROYECTOS, VOLUNTARIADOS
  * Título de sección: font-size 13px, font-weight 700, color #1E293B, text-transform uppercase, letter-spacing 1px, border-bottom 1px solid #E2E8F0, padding-bottom 4px, margin-bottom 12px
  * Empresa/institución: font-weight 700, font-size 13px, color #1E293B
  * Cargo/grado: font-style italic, font-size 12px, color #2563EB
  * Fechas: float right o flex justify-between, font-size 11px, color #64748B
  * Descripción: font-size 12px, color #475569, line-height 1.6, margin-top 4px
  * Bullets: color #2563EB (·), font-size 12px

COLORES CLAVE: #2563EB (azul acento), #1E293B (azul oscuro), #64748B (gris texto), #fff (fondo)
FUENTE: Arial, Helvetica, sans-serif
TAMAÑO: max-width 794px, margin 0 auto
`,

  // ── CLÁSICO: Tipo imagen 4 — Richard Sanchez, franja azul oscuro arriba ──
  clasico: `
ESTILO: Clásico Ejecutivo — Inspirado en CV Richard Sanchez Marketing Manager

ESTRUCTURA HTML REQUERIDA:
- body: margin 0, font-family Arial sans-serif, background #fff
- Contenedor: max-width 794px, margin 0 auto

1. FRANJA SUPERIOR (header): background #1a2744, padding 24px 28px, display flex, align-items center, gap 20px
   * Si hay foto: img 90px x 90px, border-radius 50%, object-fit cover, border 3px solid #4A7FBF
   * Bloque texto: nombre en font-size 28px, font-weight 900, color #fff, text-transform uppercase, letter-spacing 2px
   * Cargo debajo del nombre: font-size 13px, color #7AA8D8, font-weight 400, letter-spacing 1px

2. CUERPO: display flex, flex-direction row

3. COLUMNA IZQUIERDA (32%): background #f5f7fa, padding 24px 18px
   Secciones en orden:
   - CONTACT: cada item con icono emoji pequeño + texto, font-size 11px, color #374151
   - EDUCATION: institución bold, carrera en italic, años en color gris, font-size 11px
   - SKILLS: lista simple, cada skill con bullet azul ■, font-size 11px
   - LANGUAGES: idioma + nivel en bold, font-size 11px
   
   Título de cada sección izquierda: font-size 11px, font-weight 700, color #1a2744, text-transform uppercase, letter-spacing 1.5px, border-bottom 2px solid #1a2744, padding-bottom 4px, margin-bottom 10px, margin-top 18px

4. COLUMNA DERECHA (68%): padding 24px 22px, background #fff
   Secciones en orden:
   - PROFILE: resumen en párrafo, font-size 12px, color #374151, line-height 1.7
   - WORK EXPERIENCE: para cada experiencia:
     * empresa + fechas en la misma línea (flex justify-between)
     * empresa: font-weight 700, font-size 13px, color #1a2744
     * fechas: font-size 11px, color #6B7280
     * cargo + lugar/ciudad en la misma línea (flex justify-between)
     * cargo: font-style italic, font-size 12px, color #4A7FBF
     * descripción: font-size 12px, color #374151, margin-top 4px
     * bullets con "•"
   - REFERENCE (si hay espacio): dos columnas con nombre y cargo de referencia ficticio o vacío
   
   Título de cada sección derecha: font-size 13px, font-weight 700, color #1a2744, text-transform uppercase, letter-spacing 1px, border-bottom 2px solid #1a2744, padding-bottom 4px, margin-bottom 12px, margin-top 20px

PALETA: #1a2744 (azul oscuro), #4A7FBF (azul medio), #f5f7fa (gris claro), #fff (blanco)
FUENTE: Arial, sans-serif
TAMAÑO: max-width 794px
`,

  // ── MINIMALISTA: Una columna, mucho espacio, sin colores ──
  minimalista: `
ESTILO: Minimalista Nórdico

ESTRUCTURA HTML REQUERIDA:
- body: margin 0, font-family 'Helvetica Neue', Helvetica, Arial, sans-serif, background #fff, color #111
- Contenedor: max-width 680px, margin 0 auto, padding 48px 40px
- Si hay foto: img 80px, border-radius 50%, float left, margin-right 20px, margin-bottom 8px

CABECERA:
- Nombre: font-size 32px, font-weight 300, color #111, letter-spacing -0.5px, margin 0
- Cargo: font-size 14px, color #6B7280, font-weight 400, margin-top 4px
- Contacto: font-size 12px, color #9CA3AF, display inline con separadores " · "
- Línea divisora: border-top 1px solid #E5E7EB, margin 20px 0

SECCIONES (RESUMEN, EXPERIENCIA, EDUCACIÓN, HABILIDADES, HERRAMIENTAS, IDIOMAS, etc.):
- Título: font-size 10px, font-weight 600, color #9CA3AF, text-transform uppercase, letter-spacing 2px, margin-bottom 12px
- Separados por mucho espacio en blanco (margin-bottom 32px entre secciones)
- SIN bordes de colores, SIN bullets de color
- Empresa/institución: font-size 14px, font-weight 600, color #111
- Cargo/grado: font-size 13px, color #374151, font-style italic
- Fechas: font-size 11px, color #9CA3AF, float right
- Descripción: font-size 13px, color #4B5563, line-height 1.7, margin-top 6px
- Skills/idiomas: inline separados por "  ·  " en color #4B5563, font-size 13px
- Sin bullets visibles, sin líneas horizontales entre items

NORMAS: Sin colores de acento. Sin backgrounds de color. Sin sidebars. Todo en una columna.
FUENTE: Helvetica Neue o Helvetica, weight 300 para texto, 600 para títulos
`,

  // ── CREATIVO: Combinación imagen 2 (Alene) + imagen 3 (Amelia) ──
  creativo: `
ESTILO: Creativo — Combinación Alene Diaz + Amelia Ocampo

ESTRUCTURA HTML REQUERIDA:
- body: margin 0, font-family 'Arial', sans-serif, background #f9f9f9
- Contenedor: max-width 794px, margin 0 auto, display flex, min-height 100%

COLUMNA IZQUIERDA (38%): background linear-gradient(180deg, #2d9c7e 0%, #1f7a60 100%), color #fff, padding 28px 20px
Contenido de arriba a abajo:
  1. FOTO: si hay foto, img 110px circular centrada con border 3px dashed rgba(255,255,255,0.6), margin 0 auto 12px, display block
  2. NOMBRE: text-align center, font-size 20px, font-weight 700, color #fff, margin-bottom 4px
  3. CARGO: text-align center, font-size 12px, color rgba(255,255,255,0.8), margin-bottom 20px
  4. Divisor: border-top 1px solid rgba(255,255,255,0.2), margin-bottom 16px
  5. PERFIL PROFESIONAL: 
     - Título sección: font-size 10px, letter-spacing 1.5px, text-transform uppercase, color rgba(255,255,255,0.7), margin-bottom 8px
     - Texto resumen: font-size 11px, color rgba(255,255,255,0.9), line-height 1.6
  6. CONTACTO:
     - Título sección igual al anterior
     - Cada item: emoji icono + texto, font-size 11px, color rgba(255,255,255,0.9), margin-bottom 6px
  7. HABILIDADES:
     - Título sección igual
     - Cada skill en un badge: background rgba(255,255,255,0.2), border-radius 20px, padding 4px 10px, font-size 10px, color #fff, margin 3px 2px, display inline-block
  8. IDIOMAS:
     - Título sección igual
     - Cada idioma con barra de progreso:
       * nombre: font-size 11px, color #fff
       * barra: height 4px, background rgba(255,255,255,0.2), border-radius 2px, con div interno background #fff para el nivel (Nativo=100%, Avanzado=80%, Intermedio=60%, Básico=40%)

COLUMNA DERECHA (62%): background #fff, padding 28px 24px
Secciones con línea de tiempo tipo imagen 3:
  1. Título principal de sección:
     - font-size 12px, font-weight 700, color #2d9c7e, text-transform uppercase, letter-spacing 1px
     - Con pequeño círculo verde ● antes del título
     - border-bottom 1px solid #E5E7EB, padding-bottom 6px, margin-bottom 14px
  
  2. EDUCACIÓN SUPERIOR:
     Cada ítem: display flex
     - Izquierda (años): font-size 10px, color #9CA3AF, min-width 70px, padding-top 2px
     - Derecha: 
       * institución: font-weight 700, font-size 13px, color #111827
       * carrera: font-size 12px, color #374151, font-style italic
       * descripción breve si existe: font-size 11px, color #6B7280
  
  3. EXPERIENCIA LABORAL:
     Cada ítem igual estructura que educación pero con:
       * cargo: font-weight 700, font-size 13px, color #111827
       * empresa: font-size 12px, color #2d9c7e
       * descripción: font-size 11px, color #374151, line-height 1.6, bullets con "▸"
  
  4. CERTIFICACIONES (si existen): lista simple con ✓ verde
  
  5. HERRAMIENTAS (si existen en la columna derecha, si no van al sidebar):
     Inline chips con border 1px solid #E5E7EB, border-radius 4px, padding 2px 8px, font-size 11px

PALETA PRINCIPAL: #2d9c7e (verde), rgba(255,255,255,0.x) para elementos en sidebar, #111827 texto oscuro
`,
};

// ─────────────────────────────────────────────────────────────
// GENERATE CV
// ─────────────────────────────────────────────────────────────

export async function generateCV(
  formData: any,
  style: string = "moderno",
  mode: string = "designed"
): Promise<string> {

  // Sanitizar style para evitar inyección
  const validStyles = ["moderno", "clasico", "minimalista", "creativo"];
  const safeStyle = validStyles.includes(style) ? style : "moderno";
  const styleGuide = styleGuides[safeStyle];

  // Separar foto del formData antes de enviar a la IA
  const { cleanData, photoBase64 } = stripPhoto(formData);
  const hasPhoto = photoBase64 !== null && mode !== "ats";

  const photoInstruction = hasPhoto
    ? `
FOTO DEL CANDIDATO:
Existe foto de perfil. Incluí un elemento img con:
  - id="cv-photo"
  - src="PHOTO_PLACEHOLDER"   ← usar EXACTAMENTE este texto, no inventar URL
  - style="width:110px;height:110px;object-fit:cover;border-radius:50%;display:block;"
Ubicarlo en la posición indicada por el estilo (sidebar o header).
`
    : `\nNO incluir etiqueta img ni foto en ninguna parte del CV.\n`;

  // ── MODO ATS: una columna, limpio, sin decoración, tipo imagen 1 ──
  const atsGuide = `
ESTILO ATS — Formato Clásico Una Columna (tipo Francisco Mercado):

ESTRUCTURA:
- body: margin 0, font-family Arial, background #fff, color #000, font-size 12px
- Contenedor: max-width 700px, margin 0 auto, padding 36px 40px
- SIN sidebars, SIN columnas múltiples, SIN colores, SIN imágenes, SIN iconos gráficos

CABECERA:
- Nombre: text-align center, font-size 26px, font-weight 900, text-transform uppercase, letter-spacing 1px, margin-bottom 6px
- Contacto: text-align center, font-size 12px, color #333, separados con " · " o " - "
  Formato: (teléfono) · dirección · email
- Línea: border-bottom 1px solid #000, margin 12px 0

SECCIONES (EXPERIENCIA LABORAL, EDUCACIÓN, CERTIFICACIONES, HABILIDADES PROFESIONALES Y PERSONALES):
- Título: font-size 14px, font-weight 700, text-transform uppercase, color #000
- Línea debajo del título: border-bottom 1px solid #000, margin-bottom 8px
- Cargo/empresa: font-weight 700, display flex, justify-content space-between
  * lado izquierdo: cargo en bold
  * lado derecho: "Empresa · Fecha inicio - Fecha fin" en normal
- Descripción: párrafo normal, text-align justify, margin-top 4px, line-height 1.5
- Educación: institución bold, carrera en italic, años a la derecha
- Certificaciones: lista con bullets "•"
- Habilidades: lista con bullets "•"
- Idiomas al final en la misma sección de habilidades

NORMAS ESTRICTAS:
- Sin colores de fondo
- Sin fotos
- Sin iconos decorativos
- Sin tablas HTML complejas
- Sin gradientes
- Sin emojis en contenido (solo en contacto si es necesario)
- Máximo 2 páginas
- Compatible 100% con parsers ATS
`;

  const prompt = `
Eres un experto diseñador de CVs.

Tu única tarea es generar HTML PURO y COMPLETO.

REGLAS ABSOLUTAS:
- Responde ÚNICAMENTE con el HTML
- NO escribas explicaciones antes ni después
- NO uses markdown ni comillas triples
- La respuesta debe comenzar EXACTAMENTE con: <!DOCTYPE html>
- La respuesta debe terminar EXACTAMENTE con: </html>

DATOS DEL CANDIDATO:
${JSON.stringify(cleanData, null, 2)}

${photoInstruction}

${mode === "ats" ? atsGuide : styleGuide}

REQUISITOS TÉCNICOS GENERALES:
- Todo el CSS dentro de una etiqueta <style> en el <head>
- max-width 794px (tamaño A4)
- Usar SOLO los datos reales del JSON proporcionado
- NO inventar datos, NO agregar placeholders de texto
- NO cambiar nombres, fechas ni cargos
- Mostrar TODAS las secciones que tengan datos: experiencia, educación, habilidades, herramientas, idiomas, certificaciones (si existen), proyectos (si existen), voluntariados (si existen)
- El resultado debe verse profesional y listo para imprimir o exportar a PDF
- Al FINAL del bloque <style>, incluir SIEMPRE estas reglas de impresión:
  @media print {
    body { margin: 0 !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { margin: 0; size: A4 portrait; }
  }
`;

  let html = await callWithFallback([{ role: "user", content: prompt }]);
  html = extractHTML(html);

  if (hasPhoto && photoBase64) {
    html = injectPhoto(html, photoBase64);
  }

  return html;
}

// ─────────────────────────────────────────────────────────────
// EDIT CV
// ─────────────────────────────────────────────────────────────

export async function editCV(currentHTML: string, userPrompt: string): Promise<string> {
  const photoMatch = currentHTML.match(/src="(data:image\/[^"]{20,})"/);
  const savedPhoto = photoMatch ? photoMatch[1] : null;

  let htmlForAI = currentHTML;
  if (savedPhoto) {
    htmlForAI = currentHTML.replace(savedPhoto, "PHOTO_PLACEHOLDER");
  }

  const prompt = `
Eres un experto diseñador de CVs.

Modifica el HTML del CV según la instrucción del usuario.

REGLAS ABSOLUTAS:
- Responde ÚNICAMENTE con el HTML modificado
- NO escribas explicaciones
- NO uses markdown ni comillas triples
- Debe comenzar con <!DOCTYPE html> y terminar con </html>
- Si hay src="PHOTO_PLACEHOLDER", mantenerlo EXACTAMENTE así

CV ACTUAL:
${htmlForAI}

INSTRUCCIÓN DEL USUARIO:
${userPrompt}

NORMAS:
- Mantener todos los datos del candidato
- Solo modificar lo que indica la instrucción
- Mantener HTML válido y bien formado
`;

  let html = await callWithFallback([{ role: "user", content: prompt }]);
  html = extractHTML(html);

  if (savedPhoto) {
    html = html.replace("PHOTO_PLACEHOLDER", savedPhoto);
  }

  return html;
}

// ─────────────────────────────────────────────────────────────
// SUGGEST FIELD
// ─────────────────────────────────────────────────────────────

export async function suggestField(
  userText: string,
  context: string,
  systemPrompt: string,
  examples?: string[]
): Promise<string> {
  const examplesText = examples?.length
    ? `\nEJEMPLOS DE REFERENCIA:\n${examples.join("\n\n")}\n`
    : "";

  const prompt = `
${systemPrompt}

CONTEXTO DEL CAMPO:
${context}

${examplesText}

Transforma el siguiente texto informal en una versión profesional para CV.

TEXTO DEL USUARIO:
"""${userText}"""

REGLAS:
- Responde SOLO el texto transformado, sin preámbulo ni explicación
- Sin markdown, sin comillas triples
- Lenguaje profesional en español latinoamericano
- Máximo 4 líneas o 4 ítems según el contexto
- Verbos de acción en tiempo pasado para experiencia
`;

  const result = await callWithFallback([{ role: "user", content: prompt }]);
  return extractText(result);
}