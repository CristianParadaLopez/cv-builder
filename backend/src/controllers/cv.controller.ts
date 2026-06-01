// backend/src/controllers/cv.controller.ts
// CORREGIDO:
// - Validación de style y mode contra valores permitidos
// - Validación de campos mínimos
// - NUEVO: handleDownloadPDF con Playwright

import { Request, Response } from "express";
import { chromium } from "playwright";
import { generateCV, editCV, suggestField } from "../services/claude.service";

const VALID_STYLES = ["moderno", "clasico", "minimalista", "creativo"] as const;
const VALID_MODES = ["ats", "designed"] as const;
const VALID_CONTEXTS = [
  "experience", "summary", "education",
  "skills", "tools", "project", "certification", "volunteer",
] as const;

// ─── GENERATE ────────────────────────────────────────────────

export async function handleGenerateCV(req: Request, res: Response) {
  try {
    const { formData, style, mode } = req.body;

    if (!formData || typeof formData !== "object") {
      return res.status(400).json({ error: "Los datos del formulario son requeridos" });
    }

    if (!formData.name || !formData.email) {
      return res.status(400).json({ error: "Nombre y email son campos requeridos" });
    }

    const safeStyle = VALID_STYLES.includes(style) ? style : "moderno";
    const safeMode = VALID_MODES.includes(mode) ? mode : "designed";

    console.log(`📄 Generando CV: style=${safeStyle}, mode=${safeMode}, candidato=${formData.name}`);

    const html = await generateCV(formData, safeStyle, safeMode);

    return res.status(200).json({ html });
  } catch (error) {
    console.error("❌ Error generando CV:", error);
    return res.status(500).json({
      error: "Error al generar el CV. Por favor intentá de nuevo.",
    });
  }
}

// ─── EDIT ─────────────────────────────────────────────────────

export async function handleEditCV(req: Request, res: Response) {
  try {
    const { currentHTML, prompt } = req.body;

    if (!currentHTML || typeof currentHTML !== "string") {
      return res.status(400).json({ error: "El HTML actual es requerido" });
    }

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "El prompt de edición es requerido" });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({ error: "El prompt es demasiado largo (máximo 1000 caracteres)" });
    }

    console.log(`✏️ Editando CV: prompt="${prompt.substring(0, 60)}..."`);

    const html = await editCV(currentHTML, prompt);

    return res.status(200).json({ html });
  } catch (error) {
    console.error("❌ Error editando CV:", error);
    return res.status(500).json({
      error: "Error al editar el CV. Por favor intentá de nuevo.",
    });
  }
}

// ─── SUGGEST ──────────────────────────────────────────────────

export async function handleSuggestField(req: Request, res: Response) {
  try {
    const { userText, context, systemPrompt, examples } = req.body;

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({ error: "El texto del usuario es requerido" });
    }

    if (!context || typeof context !== "string") {
      return res.status(400).json({ error: "El contexto es requerido" });
    }

    if (!VALID_CONTEXTS.includes(context as any)) {
      return res.status(400).json({ error: "Contexto inválido" });
    }

    if (userText.length > 600) {
      return res.status(400).json({ error: "El texto es demasiado largo (máximo 600 caracteres)" });
    }

    console.log(`💡 Sugerencia IA: context=${context}`);

    const suggestion = await suggestField(userText, context, systemPrompt || "", examples);

    return res.status(200).json({ suggestion });
  } catch (error) {
    console.error("❌ Error generando sugerencia:", error);
    return res.status(500).json({
      error: "Error al generar sugerencia. Por favor intentá de nuevo.",
    });
  }
}

// ─── DOWNLOAD PDF (NUEVO) ─────────────────────────────────────

export async function handleDownloadPDF(req: Request, res: Response) {
  let browser = null;

  try {
    const { html } = req.body;

    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "HTML es requerido" });
    }

    // Lanzar Chrome headless
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Cargar el HTML directamente
    await page.setContent(html, {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    // Esperar que renderice fuentes y estilos
    await page.waitForTimeout(1200);

    // Generar PDF en memoria
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      preferCSSPageSize: true,
    });

    // Enviar como descarga directa
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="mi-cv-skillara.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    return res.status(500).json({
      error: "Error al generar el PDF. Intentá de nuevo.",
    });
  } finally {
    if (browser) await browser.close();
  }
}