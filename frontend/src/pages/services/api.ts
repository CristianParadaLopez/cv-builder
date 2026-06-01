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

export async function downloadPDF(html: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/cv/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });
  if (!response.ok) {
    // Intentar leer el error como JSON; si falla, usar texto plano
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al generar el PDF");
    }
    throw new Error(`Error ${response.status} al generar el PDF`);
  }
  // Verificar que la respuesta sea realmente un PDF
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/pdf")) {
    const text = await response.text();
    throw new Error(`Respuesta inesperada del servidor: ${text.slice(0, 100)}`);
  }
  return response.blob();
}