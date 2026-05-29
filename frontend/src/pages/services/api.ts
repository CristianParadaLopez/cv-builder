// src/services/api.ts
// PASO 4 — Bug fix: todas las rutas usan /api/cv/...

import type { CVFormData, CVStyle, CVMode } from "../types/cv.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function generateCV(
  formData: CVFormData,
  style: CVStyle,
  mode: CVMode
): Promise<string> {
  const response = await fetch(`${API_URL}/api/cv/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formData, style, mode }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Error al generar el CV");
  }

  const data = await response.json();
  return data.html;
}

export async function editCV(currentHTML: string, prompt: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/cv/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentHTML, prompt }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Error al editar el CV");
  }

  const data = await response.json();
  return data.html;
}

export async function suggestField(
  userText: string,
  context: string,
  systemPrompt: string,
  examples?: string[]
): Promise<string> {
  const response = await fetch(`${API_URL}/api/cv/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userText, context, systemPrompt, examples }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Error al generar sugerencia");
  }

  const data = await response.json();
  return data.suggestion;
}