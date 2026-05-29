// src/pages/Builder.tsx
import { useState } from "react";
import {
  Sun,
  Moon,
  Download,
  ChevronLeft,
  ChevronRight,
  Palette,
  User,
  Briefcase,
  Wrench,
  Rocket,
  FileDown,
  Loader2,
} from "lucide-react";

import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import PixelLoader from "../components/PixelLoader";
import PromptBar from "../components/PromptBar";
import TemplateSelector from "../components/TemplateSelector";

import { useCV } from "./hooks/useCV";
import type { CVMode } from "./types/cv.types";
import Footer from "../components/Footer";

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

const stepLabels = [
  { icon: Palette, label: "Diseño" },
  { icon: User, label: "Datos" },
  { icon: Briefcase, label: "Experiencia" },
  { icon: Wrench, label: "Habilidades" },
  { icon: Rocket, label: "Resultado" },
];

export default function Builder({ dark, setDark }: Props) {
  const [mode, setMode] = useState<CVMode>("designed");

  const {
    html,
    loading,
    error,
    style,
    setStyle,
    handleGenerate,
    handleEdit,
  } = useCV(mode);

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  async function handleGenerateWithSuccess(formData: any) {
    if (loading || hasGenerated) return; // ← protección
    setHasGenerated(true);
    await handleGenerate(formData);
    setSuccess(true);
    setStep(5);

     setTimeout(() => { setSuccess(false); setHasGenerated(false); }, 4000);
  }

  async function handleDownload() {
    if (!html) return;

    setDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.createElement("div");
      element.style.position = "fixed";
      element.style.left = "-9999px";
      element.style.top = "0";
      element.style.width = "794px"; // A4
      element.style.zIndex = "-1";
      document.body.appendChild(element);

      await html2pdf()
        .set({
          margin: 0,
          filename: "mi-cv-skillara.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();

      document.body.removeChild(element);
    } catch (e) {
      console.error("Error al generar PDF:", e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* BG GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--glow-1), transparent 70%)",
            transform: "translate(20%,-20%)",
          }}
        />

        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--glow-2), transparent 70%)",
            transform: "translate(-20%,20%)",
          }}
        />
      </div>

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between gap-4"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            }}
          >
            S
          </div>

          <div className="hidden sm:block">
            <p
              className="text-sm font-bold leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Skillara AI
            </p>

            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Generador de CV
            </p>
          </div>
        </div>

        {/* STEP INDICATORS */}
        <div className="hidden md:flex items-center gap-1">
          {stepLabels.map((s, i) => {
            const n = i + 1;

            const Icon = s.icon;

            const active = step === n;
            const done = step > n;

            return (
              <div key={n} className="flex items-center gap-1">
                <button
                  onClick={() => { if (done) setStep(n); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                    ${done ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
                  style={{
                    background: active
                      ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))"
                      : done
                      ? "var(--bg-card2)"
                      : "transparent",

                    color: active
                      ? "white"
                      : done
                      ? "var(--text)"
                      : "var(--text-muted)",

                    border:
                      active || done
                        ? "1px solid var(--border)"
                        : "1px solid transparent",
                  }}
                >
                  <Icon size={13} />
                  {s.label}
                </button>

                {i < stepLabels.length - 1 && (
                  <ChevronRight
                    size={12}
                    style={{ color: "var(--border)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:scale-110"
            style={{
              background: "var(--bg-card2)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {html && step === 5 && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm"
            >
              {downloading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileDown size={15} />
              )}

              {downloading ? "Generando..." : "Descargar PDF"}
            </button>
          )}
        </div>
      </header>

      {/* SUCCESS TOAST */}
      {success && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-slide-up"
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
          }}
        >
          ✅ CV generado correctamente
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* STEP HEADER */}
        {step <= 4 && (
          <div className="text-center mb-12 animate-slide-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{
                background: "var(--bg-card2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {(() => {
                const Icon = stepLabels[step - 1].icon;

                return (
                  <Icon
                    size={14}
                    style={{ color: "var(--accent-1)" }}
                  />
                );
              })()}

              Paso {step} de 5
            </div>

            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">
              {
                [
                  "Elegí tu diseño",
                  "Datos personales",
                  "Experiencia y educación",
                  "Habilidades y herramientas",
                  "Tu CV está listo",
                ][step - 1]
              }
            </h2>

            <p
              className="text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              {
                [
                  "Seleccioná el estilo visual para tu CV",
                  "Completá tu información básica",
                  "Agregá tu historial profesional",
                  "Agregá skills, tecnologías e idiomas",
                  "Revisá tu diseño y exportalo en PDF",
                ][step - 1]
              }
            </p>
          </div>
        )}

        {/* STEP 5 HEADER */}
        {step === 5 && (
          <div className="text-center mb-12 animate-slide-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{
                background: "var(--bg-card2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Rocket
                size={14}
                style={{ color: "var(--accent-2)" }}
              />

              Paso 5 de 5
            </div>

            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">
              Tu CV está listo
            </h2>

            <p
              className="text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              Revisá tu diseño y exportalo en PDF
            </p>
          </div>
        )}

        {/* STEP 1 — TEMPLATE */}
        {step === 1 && (
          <div className="max-w-5xl mx-auto animate-slide-up">
            <TemplateSelector
              selected={style}
              onSelect={setStyle}
              selectedMode={mode}
              onSelectMode={setMode}
            />

            <div className="flex justify-center mt-10">
              <button
                onClick={() => setStep(2)}
                className="btn-primary flex items-center gap-2"
              >
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEPS 2-4 */}
        {(step === 2 || step === 3 || step === 4) && (
          <div className="max-w-5xl mx-auto animate-slide-up">
            <CVForm
              step={step}
              setStep={setStep}
              onSubmit={handleGenerateWithSuccess}
              loading={loading}
              mode={mode}
            />

            <div className="flex justify-start mt-6">
              <button
                onClick={() => setStep(step - 1)}
                className="btn-ghost flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Volver
              </button>
            </div>
          </div>
        )}

        {/* VER SI FUNCIONA */}
{loading && (
              <div className="flex justify-center">
                <PixelLoader />
              </div>
            )}
        {/* STEP 5 */}
        {step === 5 && (
          <div className="animate-slide-up">
            {error && (
              <div
                className="max-w-3xl mx-auto rounded-2xl p-5 mb-8 text-red-400 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                ❌ {error}
              </div>
            )}

            {/* {loading && (
              <div className="flex justify-center">
                <PixelLoader />
              </div>
            )} */}

            {!loading && html && (
              <div className="max-w-5xl mx-auto">
                <CVPreview html={html} />

                <div className="mt-8">
                  <PromptBar
                    onEdit={handleEdit}
                    loading={loading}
                    disabled={!html}
                  />
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-10">
                  <button
                    onClick={() => setStep(4)}
                    className="btn-ghost flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Editar habilidades
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {downloading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}

                    {downloading
                      ? "Generando PDF..."
                      : "Descargar PDF"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}