import { useState, useEffect, useCallback } from "react";
// Ajustar este path según dónde viva el archivo:
// Si está en src/pages/hooks/ → import from "../types/cv.types"
// Si está en src/hooks/       → import from "../pages/types/cv.types"
import type { CVFormData, CVStyle } from "../types/cv.types";

const STORAGE_KEY = "skillara_cv_form_data";
const STORAGE_HTML_KEY = "skillara_cv_html";
const STORAGE_STYLE_KEY = "skillara_cv_style";
const STORAGE_TIMESTAMP_KEY = "skillara_cv_timestamp";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function clearAllStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_HTML_KEY);
  localStorage.removeItem(STORAGE_STYLE_KEY);
  localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  try { sessionStorage.removeItem(STORAGE_HTML_KEY); } catch (_) {}
}

interface PersistedData {
  formData: CVFormData | null;
  html: string;
  style: CVStyle;
  timestamp: number;
}

function loadPersistedData(): PersistedData {
  const empty: PersistedData = { formData: null, html: "", style: "moderno", timestamp: 0 };
  try {
    const savedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const timestamp = savedTimestamp ? parseInt(savedTimestamp) : 0;
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

export function usePersistCV() {
  const [persistedData, setPersistedData] = useState<PersistedData>(loadPersistedData);

  const persistFormData = useCallback((formData: CVFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.error("Error guardando formData:", e);
    }
  }, []);

  const persistHTML = useCallback((html: string) => {
    try {
      localStorage.setItem(STORAGE_HTML_KEY, html);
      setPersistedData(prev => ({ ...prev, html }));
    } catch (e) {
      console.warn("HTML demasiado grande para localStorage, usando sessionStorage");
      try {
        sessionStorage.setItem(STORAGE_HTML_KEY, html);
        setPersistedData(prev => ({ ...prev, html }));
      } catch (err) {
        console.error("No se pudo guardar el HTML:", err);
      }
    }
  }, []);

  const persistStyle = useCallback((style: CVStyle) => {
    try {
      localStorage.setItem(STORAGE_STYLE_KEY, style);
      setPersistedData(prev => ({ ...prev, style }));
    } catch (e) {
      console.error("Error guardando estilo:", e);
    }
  }, []);

  const persistAll = useCallback((data: { formData: CVFormData; html: string; style: CVStyle }) => {
    persistFormData(data.formData);
    persistHTML(data.html);
    persistStyle(data.style);
  }, [persistFormData, persistHTML, persistStyle]);

  const clearPersistedData = useCallback(() => {
    clearAllStorage();
    setPersistedData({ formData: null, html: "", style: "moderno", timestamp: 0 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

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