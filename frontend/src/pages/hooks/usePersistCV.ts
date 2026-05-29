// src/hooks/usePersistCV.ts
// CORREGIDO:
// - clearPersistedData extraída fuera del hook para poder usarse en loadPersistedData
// - persistedData.html y persistedData.style expuestos correctamente para useCV
// - Path correcto: este archivo vive en src/hooks/ (no src/pages/hooks/)
// - Lógica de expiración de 30 días mantenida

import { useState, useEffect, useCallback } from "react";
import type { CVFormData, CVStyle } from "../types/cv.types";

const STORAGE_KEY = "skillara_cv_form_data";
const STORAGE_HTML_KEY = "skillara_cv_html";
const STORAGE_STYLE_KEY = "skillara_cv_style";
const STORAGE_TIMESTAMP_KEY = "skillara_cv_timestamp";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// ─── Limpiar fuera del hook para poder llamar desde loadPersistedData ──

function clearAllStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_HTML_KEY);
  localStorage.removeItem(STORAGE_STYLE_KEY);
  localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  try { sessionStorage.removeItem(STORAGE_HTML_KEY); } catch (_) {}
}

// ─── TIPOS ───────────────────────────────────────────────────

interface PersistedData {
  formData: CVFormData | null;
  html: string;
  style: CVStyle;
  timestamp: number;
}

// ─── LOADER ──────────────────────────────────────────────────

function loadPersistedData(): PersistedData {
  const empty: PersistedData = {
    formData: null,
    html: "",
    style: "moderno",
    timestamp: 0,
  };

  try {
    const savedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const timestamp = savedTimestamp ? parseInt(savedTimestamp) : 0;

    // Validar expiración
    if (timestamp && Date.now() - timestamp > THIRTY_DAYS) {
      clearAllStorage();
      return empty;
    }

    const savedForm = localStorage.getItem(STORAGE_KEY);
    const savedHtml =
      localStorage.getItem(STORAGE_HTML_KEY) ||
      sessionStorage.getItem(STORAGE_HTML_KEY) ||
      "";
    const savedStyle = localStorage.getItem(STORAGE_STYLE_KEY) as CVStyle | null;

    return {
      formData: savedForm ? JSON.parse(savedForm) : null,
      html: savedHtml,
      style: savedStyle || "moderno",
      timestamp,
    };
  } catch (e) {
    console.error("Error cargando datos persistidos:", e);
    return empty;
  }
}

// ─── HOOK ────────────────────────────────────────────────────

export function usePersistCV() {
  const [persistedData, setPersistedData] = useState<PersistedData>(loadPersistedData);

  // Guardar formData
  const persistFormData = useCallback((formData: CVFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.error("Error guardando formData:", e);
    }
  }, []);

  // Guardar HTML generado
  const persistHTML = useCallback((html: string) => {
    try {
      localStorage.setItem(STORAGE_HTML_KEY, html);
      setPersistedData(prev => ({ ...prev, html }));
    } catch (e) {
      // localStorage puede fallar con HTMLs grandes → usar sessionStorage
      console.warn("HTML demasiado grande para localStorage, usando sessionStorage");
      try {
        sessionStorage.setItem(STORAGE_HTML_KEY, html);
        setPersistedData(prev => ({ ...prev, html }));
      } catch (err) {
        console.error("No se pudo guardar el HTML:", err);
      }
    }
  }, []);

  // Guardar estilo
  const persistStyle = useCallback((style: CVStyle) => {
    try {
      localStorage.setItem(STORAGE_STYLE_KEY, style);
      setPersistedData(prev => ({ ...prev, style }));
    } catch (e) {
      console.error("Error guardando estilo:", e);
    }
  }, []);

  // Guardar todo de una vez
  const persistAll = useCallback((data: { formData: CVFormData; html: string; style: CVStyle }) => {
    persistFormData(data.formData);
    persistHTML(data.html);
    persistStyle(data.style);
  }, [persistFormData, persistHTML, persistStyle]);

  // Limpiar todo
  const clearPersistedData = useCallback(() => {
    clearAllStorage();
    setPersistedData({ formData: null, html: "", style: "moderno", timestamp: 0 });
  }, []);

  // Refrescar timestamp cada 10 segundos si hay datos
  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Advertir al usuario si intenta salir con datos sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    persistedData,
    persistFormData,
    persistHTML,
    persistStyle,
    persistAll,
    clearPersistedData,
    hasPersistedData: !!persistedData.formData,
  };
}