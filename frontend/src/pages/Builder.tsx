// src/pages/Builder.tsx
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Sun, Moon, Download, ChevronLeft, ChevronRight,
  Palette, User, Briefcase, Wrench, Rocket,
  FileDown, Loader2, Check, Menu, X, FileCheck,
  Home, Save,
} from "lucide-react";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import PixelLoader from "../components/PixelLoader";
import PromptBar from "../components/PromptBar";
import TemplateSelector from "../components/TemplateSelector";
import Footer from "../components/Footer";

import { useCV } from "./hooks/useCV";
import { usePersistCV } from "./hooks/usePersistCV";
import type { CVMode } from "./types/cv.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveCV } from "./services/cvStorage";

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

const FORM_STEPS = [
  { icon: Palette, label: "Diseño", shortLabel: "Diseño", description: "Elegí tu plantilla" },
  { icon: User, label: "Datos", shortLabel: "Datos", description: "Información personal" },
  { icon: Briefcase, label: "Experiencia", shortLabel: "Exp.", description: "Trabajo y educación" },
  { icon: Wrench, label: "Habilidades", shortLabel: "Skills", description: "Habilidades y tools" },
] as const;

export default function Builder({ dark, setDark }: Props) {
  const [mode, setMode] = useState<CVMode>("designed");

  const { html, loading, error, style, setStyle, handleGenerate, handleEdit } = useCV(mode);
  const { hasPersistedData } = usePersistCV();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [success, setSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isGenerating = useRef(false);
  const userDidGenerate = useRef(false);
  const lastFormData = useRef<any>(null);

  useEffect(() => {
    if (html && !loading && userDidGenerate.current) {
      setShowResult(true);
    }
  }, [html, loading]);

  // ─── GENERAR CV ─────────────────────────────────────────────
  async function handleGenerateWithSuccess(formData: any) {
    if (isGenerating.current || loading) return;
    isGenerating.current = true;
    userDidGenerate.current = true;
    lastFormData.current = formData;

    try {
      await handleGenerate(formData);
      setSuccess(true);
      setShowResult(true);
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      isGenerating.current = false;
    }
  }

  // ─── GUARDAR CV ─────────────────────────────────────────────
  // ─── GUARDAR CV ─────────────────────────────────────────────
  async function handleSaveCV() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!html || saving) return;
    setSaving(true);
    try {
      await saveCV(user.uid, html, lastFormData.current ?? { name: "Mi CV" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Error guardando CV:", e);
    } finally {
      setSaving(false);
    }
  }

  // ─── DESCARGAR PDF ──────────────────────────────────────────
  async function handleDownload() {
    if (!html || downloading) return;
    setDownloading(true);

    const container = document.createElement("div");

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        min-height: 1123px;
        background: #ffffff;
      `;

      const styles = doc.querySelectorAll("style");
      styles.forEach((s) => container.appendChild(s.cloneNode(true)));
      container.innerHTML += doc.body.innerHTML;
      if (doc.body.className) container.className = doc.body.className;
      if (doc.body.style.cssText) container.style.cssText += doc.body.style.cssText;

      document.body.appendChild(container);
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      if (scaledHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
      } else {
        let heightLeft = scaledHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, scaledWidth, scaledHeight);
        heightLeft -= pdfHeight;
        while (heightLeft > 0) {
          position = heightLeft - scaledHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, scaledWidth, scaledHeight);
          heightLeft -= pdfHeight;
        }
      }

      pdf.save("mi-cv-skillara.pdf");

    } catch (e) {
      console.error("Error generando PDF:", e);
      const pw = window.open("", "_blank");
      if (pw) {
        pw.document.write(html);
        pw.document.close();
        setTimeout(() => pw.print(), 800);
      }
    } finally {
      if (container.parentNode) container.parentNode.removeChild(container);
      setDownloading(false);
    }
  }

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 4) {
      setStep(targetStep);
      setShowResult(false);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const goToResult = useCallback(() => {
    if (html) {
      setShowResult(true);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [html]);

  const isStepDone = useCallback((stepNum: number) => {
    if (showResult) return true;
    return step > stepNum;
  }, [showResult, step]);

  const isStepActive = useCallback((stepNum: number) => {
    if (showResult) return false;
    return step === stepNum;
  }, [showResult, step]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* BG GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)", transform: "translate(20%,-20%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--glow-2), transparent 70%)", transform: "translate(-20%,20%)" }} />
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <PixelLoader />
          <p className="mt-6 text-sm font-semibold animate-pulse" style={{ color: "var(--text-muted)" }}>
            {html ? "Editando tu CV..." : "Generando tu CV con IA..."}
          </p>
        </div>
      )}

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", backdropFilter: "blur(20px)" }}>

        {/* LOGO */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs"
            style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>S</div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>Skillara AI</p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>Generador de CV</p>
          </div>
        </div>

        {/* STEPS Desktop */}
        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {FORM_STEPS.map((s, i) => {
            const stepNum = i + 1;
            const active = isStepActive(stepNum);
            const done = isStepDone(stepNum);
            const Icon = s.icon;
            return (
              <div key={stepNum} className="flex items-center">
                <button type="button" onClick={() => goToStep(stepNum)}
                  className={`group relative flex items-center gap-1.5 px-2 lg:px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${active ? "text-white shadow-md scale-105" : ""}`}
                  style={{
                    background: active ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))" : done ? "var(--bg-card2)" : "transparent",
                    color: active ? "white" : done ? "var(--text)" : "var(--text-muted)",
                    border: active || done ? "1px solid var(--border)" : "1px solid transparent",
                  }}>
                  <span>{done && !active ? <Check size={13} className="text-emerald-400" /> : <Icon size={13} />}</span>
                  <span className="hidden lg:inline">{s.label}</span>
                  <span className="lg:hidden">{s.shortLabel}</span>
                </button>
                {i < FORM_STEPS.length - 1 && (
                  <div className="w-4 lg:w-6 h-px mx-0.5 transition-colors duration-300"
                    style={{ background: done ? "var(--accent-1)" : "var(--border)" }} />
                )}
              </div>
            );
          })}

          <div className="w-px h-6 mx-1" style={{ background: "var(--border)" }} />

          <button type="button" onClick={goToResult} disabled={!html}
            className={`flex items-center gap-1.5 px-2 lg:px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${showResult ? "text-white shadow-md scale-105" : ""} ${!html ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
            style={{
              background: showResult ? "linear-gradient(135deg, #059669, #10b981)" : html ? "var(--bg-card2)" : "transparent",
              color: showResult ? "white" : html ? "var(--text)" : "var(--text-muted)",
              border: showResult || html ? "1px solid var(--border)" : "1px solid transparent",
            }}>
            <span className="relative">
              {showResult ? <FileCheck size={13} /> : <Rocket size={13} />}
              {html && !showResult && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </span>
            <span className="hidden lg:inline">Resultado</span>
            <span className="lg:hidden">CV</span>
          </button>
        </div>

        {/* MOBILE indicator */}
        <div className="flex md:hidden items-center gap-1">
          {showResult ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)", border: "1px solid var(--border)", color: "white" }}>
              <FileCheck size={13} /><span>CV Listo</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>{step}</span>
              <span className="text-[11px]">{FORM_STEPS[step - 1].label}</span>
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* BOTÓN INICIO */}
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:scale-110"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            title="Volver al inicio"
          >
            <Home size={16} />
          </button>

          <button onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:scale-110"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {html && showResult && (
            <button onClick={handleDownload} disabled={downloading}
              className="btn-primary flex items-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm">
              {downloading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
              <span className="hidden sm:inline">{downloading ? "Preparando..." : "Descargar PDF"}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          )}
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] z-40 border-b p-4 space-y-2"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", backdropFilter: "blur(20px)" }}>
          {FORM_STEPS.map((s, i) => {
            const stepNum = i + 1;
            const active = isStepActive(stepNum);
            const done = isStepDone(stepNum);
            return (
              <button key={stepNum} onClick={() => goToStep(stepNum)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${active ? "text-white" : ""}`}
                style={{
                  background: active ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))" : done ? "var(--bg-card2)" : "transparent",
                  color: active ? "white" : "var(--text)", border: "1px solid var(--border)",
                }}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: active ? "rgba(255,255,255,0.2)" : "var(--bg-card2)" }}>
                  {done && !active ? <Check size={14} /> : <s.icon size={14} />}
                </span>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{s.label}</p>
                  <p className="text-xs opacity-70">{s.description}</p>
                </div>
                {done && !active && <Check size={16} className="text-emerald-400" />}
                {active && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
          <div className="border-t my-2" style={{ borderColor: "var(--border)" }} />
          <button onClick={goToResult} disabled={!html}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${showResult ? "text-white" : ""} ${!html ? "opacity-40 cursor-not-allowed" : ""}`}
            style={{
              background: showResult ? "linear-gradient(135deg, #059669, #10b981)" : html ? "var(--bg-card2)" : "transparent",
              color: showResult ? "white" : "var(--text)", border: "1px solid var(--border)",
            }}>
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
              style={{ background: showResult ? "rgba(255,255,255,0.2)" : "var(--bg-card2)" }}>
              {showResult ? <FileCheck size={14} /> : <Rocket size={14} />}
            </span>
            <div className="flex-1 text-left">
              <p className="font-semibold">Resultado</p>
              <p className="text-xs opacity-70">{html ? "Tu CV está listo" : "Completá los pasos primero"}</p>
            </div>
            {html && !showResult && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {success && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 text-white px-5 sm:px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-slide-up"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
          <Check size={16} />CV generado correctamente
        </div>
      )}

      {/* ─── CONTENT ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">

        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-5"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            {showResult ? (
              <><FileCheck size={14} className="text-emerald-400" /><span>CV Generado</span></>
            ) : (
              <>
                {(() => { const Icon = FORM_STEPS[step - 1].icon; return <Icon size={14} style={{ color: "var(--accent-1)" }} />; })()}
                <span>Paso {step} de 4</span>
                <span className="hidden sm:inline">— {FORM_STEPS[step - 1].description}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 sm:mb-3">
            {showResult ? "Tu CV está listo" : FORM_STEPS[step - 1].label}
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            {showResult
              ? "Revisá tu diseño, editá con IA o descargá en PDF"
              : ["Seleccioná el estilo visual para tu CV", "Completá tu información básica", "Agregá tu historial profesional", "Agregá skills, tecnologías e idiomas"][step - 1]}
          </p>
        </div>

        {/* STEP 1 */}
        {!showResult && step === 1 && (
          <div className="max-w-5xl mx-auto animate-slide-up">
            <TemplateSelector selected={style} onSelect={setStyle} selectedMode={mode} onSelectMode={setMode} />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10">
              {html && (
                <button onClick={goToResult} className="btn-ghost flex items-center gap-2 text-sm">
                  <FileCheck size={16} className="text-emerald-400" />
                  Ver CV anterior
                </button>
              )}
              <button
                onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="btn-primary flex items-center gap-2 text-sm sm:text-base">
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEPS 2-4 */}
        {!showResult && step >= 2 && step <= 4 && (
          <div className="max-w-5xl mx-auto animate-slide-up">
            <CVForm
              step={step}
              setStep={setStep}
              onSubmit={handleGenerateWithSuccess}
              loading={loading}
              mode={mode}
            />
          </div>
        )}

        {/* RESULTADO */}
        {showResult && (
          <div className="animate-slide-up">
            {error && (
              <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 mb-6 text-red-400 text-sm"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                ❌ {error}
              </div>
            )}

            {!loading && html && (
              <div className="max-w-5xl mx-auto">
                <CVPreview html={html} />
                <div className="mt-6 sm:mt-8">
                  <PromptBar onEdit={handleEdit} loading={loading} disabled={!html} />
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-8 sm:mt-10">
                  <button onClick={() => { setShowResult(false); setStep(4); }}
                    className="btn-ghost flex items-center gap-2 text-sm">
                    <ChevronLeft size={16} />Editar habilidades
                  </button>

                  {/* BOTÓN GUARDAR CV */}
                  <button
                    onClick={handleSaveCV}
                    disabled={saving || saved}
                    className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl font-semibold transition hover:scale-105"
                    style={{
                      background: saved ? "rgba(16,185,129,0.12)" : "var(--bg-card2)",
                      border: saved ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border)",
                      color: saved ? "#10b981" : "var(--text)",
                    }}
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : saved ? (
                      <Check size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? "Guardando..." : saved ? "¡Guardado!" : user ? "Guardar CV" : "Iniciar sesión para guardar"}
                  </button>

                  <button onClick={handleDownload} disabled={downloading}
                    className="btn-primary flex items-center gap-2 text-sm">
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {downloading ? "Preparando PDF..." : "Descargar PDF"}
                  </button>
                </div>
              </div>
            )}

            {!html && !loading && !error && (
              <div className="text-center py-20">
                <p style={{ color: "var(--text-muted)" }}>No hay CV generado. Volvé al formulario.</p>
                <button onClick={() => { setShowResult(false); setStep(4); }}
                  className="btn-primary mt-4 flex items-center gap-2 mx-auto">
                  <ChevronLeft size={16} />Volver al formulario
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}