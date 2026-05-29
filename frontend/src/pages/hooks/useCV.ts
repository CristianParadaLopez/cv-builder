import { useState } from "react";

import type {
  CVFormData,
  CVStyle,
  CVMode,
} from "../../pages/types/cv.types";

import { generateCV, editCV } from "../services/api";
import { usePersistCV } from "./usePersistCV";

export function useCV(mode: CVMode = "designed") {
  const { persistHTML } = usePersistCV();
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [style, setStyle] = useState<CVStyle>("moderno");

  async function handleGenerate(formData: CVFormData) {
    setLoading(true);
    setError("");

    try {
      const result = await generateCV(formData, style, mode);

      setHtml(result);
      persistHTML(result);
    } catch (err) {
      setError("Error al generar el CV. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(prompt: string) {
    if (!html) return;

    setLoading(true);
    setError("");

    try {
      const result = await editCV(html, prompt);

      setHtml(result);
    } catch (err) {
      setError("Error al editar el CV. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return {
    html,
    loading,
    error,
    style,
    setStyle,
    handleGenerate,
    handleEdit,
  };
}

function persistHTML(result: string) {
  throw new Error("Function not implemented.");
}
