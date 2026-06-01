// src/components/AISuggestField.tsx
// FIXES:
// 1. Modal: panel usa display:flex + flexDirection:column SIN overflowY propio
//    → solo el body scrollea (flex-1 + overflow-y-auto)
//    → header y footer son shrink-0, siempre visibles
// 2. Modo oscuro: backdrop usa bg-black/50, panel usa var(--bg-card) sólido
//    sin ninguna transparencia extra que lo rompa

import { useState } from "react";
import {
  Sparkles, Loader2, Wand2, X, CheckCircle2,
  AlertTriangle, Lightbulb, RefreshCw,
} from "lucide-react";

export type SuggestContext =
  | "experience"
  | "summary"
  | "education"
  | "skills"
  | "tools"
  | "project"
  | "certification"
  | "volunteer";

interface Props {
  fieldLabel: string;
  placeholder: string;
  onAccept: (text: string) => void;
  context: SuggestContext;
  currentValue?: string;
  contextData?: {
    title?: string;
    company?: string;
    position?: string;
    institution?: string;
    degree?: string;
    organization?: string;
  };
  apiEndpoint?: string;
  compact?: boolean;
}

interface ContextConfig {
  system: string;
  userLabel: string;
  exampleInput: string;
  exampleOutput: string;
  maxLines: number;
  icon: string;
}

function getContextConfig(
  context: SuggestContext,
  contextData?: Props["contextData"]
): ContextConfig {
  const titleHint = contextData?.title ? ` El usuario trabaja como "${contextData.title}".` : "";

  const configs: Record<SuggestContext, ContextConfig> = {
    experience: {
      system: `Eres un experto en recursos humanos y redacción de CVs para el mercado latinoamericano. 
Transforma descripciones informales de experiencia laboral en descripciones profesionales 
usando verbos de acción en pasado, métricas cuando sea posible y lenguaje corporativo. 
Máximo 3-4 oraciones cortas. Sin bullet points. Sin comillas.${titleHint}
${contextData?.company ? `La empresa fue: "${contextData.company}".` : ""}
${contextData?.position ? `El cargo fue: "${contextData.position}".` : ""}`,
      userLabel: "¿Qué hiciste en ese trabajo? (en tus palabras)",
      exampleInput: "Ayudé a mi tío en construcción 2 años, aprendí a hacer cemento y más",
      exampleOutput: "Colaboré en proyectos de construcción residencial durante 2 años, desarrollando competencias en preparación de mezclas, nivelación de superficies y supervisión de obra menor.",
      maxLines: 4,
      icon: "💼",
    },
    summary: {
      system: `Eres un experto en redacción de perfiles profesionales para CVs latinoamericanos. 
Transforma descripciones informales en un resumen profesional de 3-4 líneas que destaque: 
quién es el candidato, sus fortalezas clave y su objetivo profesional. 
Sin bullet points. Sin comillas. Español latinoamericano formal.${titleHint}`,
      userLabel: "Contanos sobre vos (en tus palabras)",
      exampleInput: "Soy estudiante de computación, me gusta programar y quiero trabajar en tech",
      exampleOutput: "Estudiante de Ciencias de la Computación con sólidos conocimientos en desarrollo web full-stack. Apasionado por la innovación tecnológica y la resolución de problemas.",
      maxLines: 4,
      icon: "👤",
    },
    education: {
      system: `Eres un asesor académico profesional para CVs latinoamericanos. 
Ayuda a redactar una descripción de formación académica que destaque:
logros, proyectos relevantes, habilidades desarrolladas o actividades extracurriculares. 
Máximo 2-3 oraciones. Sin bullet points. Sin comillas. Español formal.
${contextData?.institution ? `La institución fue: "${contextData.institution}".` : ""}
${contextData?.degree ? `La carrera fue: "${contextData.degree}".` : ""}`,
      userLabel: "¿Qué hiciste o aprendiste en esa institución?",
      exampleInput: "Estudié en la UCA, hice proyectos de programación y fui monitor",
      exampleOutput: "Formación integral en la UCA con participación activa como monitor académico y desarrollo de proyectos de software aplicando metodologías ágiles y trabajo en equipo.",
      maxLines: 3,
      icon: "🎓",
    },
    skills: {
      system: `Eres un especialista en recursos humanos. 
El usuario va a describir sus habilidades blandas (soft skills) de forma informal. 
Transforma eso en una lista de 4-6 competencias profesionales redactadas con lenguaje corporativo. 
Formato: una competencia por línea, sin guiones, sin bullet points, sin numeración. 
Solo el nombre de la habilidad. Sin comillas.${titleHint}`,
      userLabel: "¿En qué sos bueno? (en tus palabras)",
      exampleInput: "Soy bueno hablando con la gente, organizando cosas y aprendo rápido",
      exampleOutput: "Comunicación interpersonal efectiva\nGestión y coordinación de proyectos\nAprendizaje autónomo acelerado\nTrabajo colaborativo en equipo",
      maxLines: 6,
      icon: "⚡",
    },
    tools: {
      system: `Eres un experto técnico en tecnología para el mercado laboral. 
El usuario describirá las herramientas o programas que usa. 
Transforma eso en una lista con los nombres técnicos correctos. 
Formato: una herramienta por línea. Sin numeración, sin bullet points. 
Usa nombres oficiales (ej: "Microsoft Excel" no "el excel"). Sin comillas.${titleHint}`,
      userLabel: "¿Qué programas, apps o herramientas usás?",
      exampleInput: "Uso el Excel, el Word, hago algo de Photoshop y sé algo de Python",
      exampleOutput: "Microsoft Excel\nMicrosoft Word\nAdobe Photoshop\nPython",
      maxLines: 6,
      icon: "🔧",
    },
    project: {
      system: `Eres un asesor de portfolios técnicos para el mercado laboral latinoamericano. 
Transforma descripciones informales de proyectos en descripciones profesionales que destaquen:
qué problema resolvía, qué tecnologías se usaron y cuál fue el resultado. 
Máximo 3 oraciones. Sin bullet points. Sin comillas. Español formal.${titleHint}`,
      userLabel: "Describí tu proyecto (en tus palabras)",
      exampleInput: "Hice una página web para una tarea de la universidad con React",
      exampleOutput: "Desarrollé una aplicación web interactiva utilizando React y Node.js como proyecto académico final, implementando autenticación de usuarios y consumo de APIs REST.",
      maxLines: 3,
      icon: "🚀",
    },
    certification: {
      system: `Eres un especialista en credenciales profesionales para CVs. 
Ayuda a redactar el contexto o descripción de una certificación de forma profesional.
Destaca qué habilidades valida y por qué es relevante. 
Máximo 2 oraciones. Sin bullet points. Sin comillas. Español formal.`,
      userLabel: "¿Qué aprendiste en ese curso/certificación?",
      exampleInput: "Hice un curso de Excel en Udemy, aprendí tablas dinámicas y fórmulas",
      exampleOutput: "Certificación en Microsoft Excel avanzado que valida competencias en análisis de datos mediante tablas dinámicas y fórmulas condicionales.",
      maxLines: 2,
      icon: "📜",
    },
    volunteer: {
      system: `Eres un experto en redacción de CVs con enfoque en experiencia de voluntariado y horas sociales. 
Transforma descripciones informales en textos profesionales que destaquen el impacto y responsabilidades. 
Máximo 3 oraciones. Verbos de acción. Sin bullet points. Sin comillas. Español formal.
${contextData?.organization ? `La organización fue: "${contextData.organization}".` : ""}`,
      userLabel: "¿Qué hiciste en ese voluntariado o horas sociales?",
      exampleInput: "Ayudé a dar clases a niños de zonas rurales durante las horas sociales de la uni",
      exampleOutput: "Impartí clases de refuerzo académico a estudiantes de zonas rurales como parte del programa de horas sociales universitarias, desarrollando material didáctico adaptado.",
      maxLines: 3,
      icon: "❤️",
    },
  };

  return configs[context];
}

export default function AISuggestField({
  fieldLabel,
  placeholder,
  onAccept,
  context,
  currentValue = "",
  contextData,
  apiEndpoint = "/api/cv/suggest",
  compact = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const config = getContextConfig(context, contextData);

  function handleOpen() {
    setIsOpen(true);
    setUserInput(currentValue ? `(Tengo esto escrito: "${currentValue.substring(0, 100)}") ` : "");
    setSuggestion("");
    setError("");
    setRetryCount(0);
  }

  function handleClose() {
    setIsOpen(false);
    setUserInput("");
    setSuggestion("");
    setError("");
    setRetryCount(0);
  }

  async function generateSuggestion() {
    if (!userInput.trim()) return;
    setLoading(true);
    setError("");
    setSuggestion("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText: userInput,
          context,
          systemPrompt: config.system,
          examples: [
            `Ejemplo de entrada: "${config.exampleInput}"`,
            `Ejemplo de salida: "${config.exampleOutput}"`,
          ],
          contextData,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Error al generar sugerencia");
      }

      const data = await response.json();
      setSuggestion(data.suggestion || "No se pudo generar sugerencia.");
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("Sin conexión al servidor. Verificá que el backend esté corriendo.");
      } else {
        setError(msg || "Error al generar sugerencia. Intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAccept() {
    onAccept(suggestion);
    handleClose();
  }

  function handleRetry() {
    setRetryCount((r) => r + 1);
    setSuggestion("");
    generateSuggestion();
  }

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          title="Generar sugerencias con IA"
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition hover:opacity-80 active:scale-95"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.12))",
            border: "1px solid rgba(124,58,237,0.25)",
            color: "#7C3AED",
          }}
        >
          <Sparkles size={11} />
          IA
        </button>
        {isOpen && (
          <ModalComponent
            config={config}
            fieldLabel={fieldLabel}
            placeholder={placeholder}
            userInput={userInput}
            setUserInput={setUserInput}
            suggestion={suggestion}
            loading={loading}
            error={error}
            retryCount={retryCount}
            onClose={handleClose}
            onGenerate={generateSuggestion}
            onAccept={handleAccept}
            onRetry={handleRetry}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))",
          border: "1px solid rgba(124,58,237,0.3)",
          color: "#7C3AED",
        }}
      >
        <Sparkles size={12} />
        ¿No sabés qué poner? La IA te ayuda
      </button>

      {isOpen && (
        <ModalComponent
          config={config}
          fieldLabel={fieldLabel}
          placeholder={placeholder}
          userInput={userInput}
          setUserInput={setUserInput}
          suggestion={suggestion}
          loading={loading}
          error={error}
          retryCount={retryCount}
          onClose={handleClose}
          onGenerate={generateSuggestion}
          onAccept={handleAccept}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}

// ─── MODAL ───────────────────────────────────────────────────

interface ModalProps {
  config: ContextConfig;
  fieldLabel: string;
  placeholder: string;
  userInput: string;
  setUserInput: (v: string) => void;
  suggestion: string;
  loading: boolean;
  error: string;
  retryCount: number;
  onClose: () => void;
  onGenerate: () => void;
  onAccept: () => void;
  onRetry: () => void;
}

function ModalComponent({
  config, fieldLabel, placeholder,
  userInput, setUserInput,
  suggestion, loading, error, retryCount,
  onClose, onGenerate, onAccept, onRetry,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop — opaco para que el modo oscuro no lo traspase */}
      <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        />

      {/*
        ESTRUCTURA CLAVE:
        - Panel: flex column, max-height 85vh, SIN overflow propio
        - Header: shrink-0 (nunca se achica)
        - Body: flex-1 + overflow-y-auto (el único que scrollea)
        - Footer: shrink-0 (siempre visible abajo)
      */}
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl animate-slide-up"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          maxHeight: "min(85vh, 680px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          // SIN overflowY aquí — solo el body scrollea
        }}
      >
        {/* ── HEADER (shrink-0, nunca desaparece) ── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))" }}
            >
              {config.icon}
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                <Wand2 size={14} style={{ color: "#7C3AED" }} />
                Asistente IA
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {fieldLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-70 shrink-0"
            style={{ color: "var(--text-muted)", background: "var(--bg-card2)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* ── BODY (flex-1, el único que scrollea) ── */}
        <div
          className="flex-1 p-6   "
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
           }}
        >
          {/* Instrucción */}
          <div
            className="p-3 rounded-xl text-xs"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
              <p style={{ color: "var(--text-muted)" }}>
                Escribí en tus propias palabras. No importa si suena informal.
                La IA lo va a convertir en lenguaje profesional para tu CV.
              </p>
            </div>
          </div>

          {/* Ejemplo */}
          <div
            className="p-3 rounded-xl text-xs space-y-1.5"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px dashed rgba(124,58,237,0.25)" }}
          >
            <p className="font-semibold" style={{ color: "#7C3AED" }}>
              Ejemplo de cómo funciona:
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              <span className="font-medium" style={{ color: "var(--text)" }}>Vos escribís:</span>{" "}
              "{config.exampleInput}"
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              <span className="font-medium" style={{ color: "var(--text)" }}>La IA genera:</span>{" "}
              "{config.exampleOutput.substring(0, 100)}..."
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              {config.userLabel}
            </label>
            <textarea
              rows={4}
              className="input-field resize-none w-full"
              placeholder={placeholder}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              maxLength={600}
              autoFocus
              style={{ color: "var(--text)", background: "var(--bg-card2)" }}
            />
            <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
              {userInput.length}/600
            </p>
          </div>

          {/* Resultado de texto (va en el body para que sea scrolleable) */}
          {suggestion && !loading && (
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-card2)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#7C3AED" }}>
                <Sparkles size={11} />
                Versión profesional generada:
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                {suggestion}
              </p>
            </div>
          )}

          {retryCount > 0 && suggestion && (
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Versión #{retryCount + 1}
            </p>
          )}
        </div>

        {/* ── FOOTER (shrink-0, siempre visible) ── */}
        <div
          className="px-6 py-4 shrink-0 space-y-2"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg-card)",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
          {/* Error */}
          {error && !loading && (
            <div
              className="p-3 rounded-xl flex items-start gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <p className="text-xs text-red-400">{error}</p>
                <button onClick={onGenerate} className="text-xs mt-1 underline" style={{ color: "#7C3AED" }}>
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}

          {/* Botón generar (cuando no hay resultado) */}
          {!suggestion && (
            <button
              onClick={onGenerate}
              disabled={loading || !userInput.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <Sparkles size={16} />}
              {loading ? "La IA está pensando..." : "Generar versión profesional"}
            </button>
          )}

          {loading && (
            <p className="text-xs text-center animate-pulse" style={{ color: "var(--text-muted)" }}>
              Analizando tu texto y generando una versión profesional...
            </p>
          )}

          {/* Botones aceptar / reintentar (cuando hay resultado) */}
          {suggestion && !loading && (
            <div className="flex gap-2">
              <button
                onClick={onAccept}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <CheckCircle2 size={15} />
                Usar esta versión
              </button>
              <button
                onClick={onRetry}
                className="flex-1 btn-ghost flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <RefreshCw size={15} />
                Otra versión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}