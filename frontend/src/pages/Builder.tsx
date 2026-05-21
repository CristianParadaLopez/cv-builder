import { useState } from "react";

import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import PixelLoader from "../components/PixelLoader";
import PromptBar from "../components/PromptBar";
import TemplateSelector from "../components/TemplateSelector";

import { useCV } from "../pages/hooks/useCV";

export default function Builder() {
  const {
    html,
    loading,
    error,
    style,
    setStyle,
    handleGenerate,
    handleEdit,
  } = useCV();

  const [step, setStep] = useState(1);

  const [success, setSuccess] = useState(false);

  const [downloading, setDownloading] = useState(false);

  async function handleGenerateWithSuccess(formData: any) {
    await handleGenerate(formData);

    setSuccess(true);

    setStep(5);

    setTimeout(() => setSuccess(false), 4000);
  }

  async function handleDownload() {
    if (!html) return;

    setDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.createElement("div");

      element.innerHTML = html;

      document.body.appendChild(element);

      await html2pdf()
        .set({
          margin: 0,
          filename: "mi-cv-skillara.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
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
    <div className="min-h-screen bg-[#0b1020] text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb22,transparent_35%),radial-gradient(circle_at_bottom_left,#7c3aed22,transparent_35%)] -z-10" />

      {/* HEADER */}
      <header className="border-b border-white/10 backdrop-blur-xl px-8 py-5 flex items-center justify-between sticky top-0 z-50 bg-[#0b1020]/70">

        {/* LOGO */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
            S
          </div>

          <div>
            <h1 className="text-xl font-black">
              Skillara AI
            </h1>

            <p className="text-xs text-gray-400">
              Generador inteligente de CV
            </p>
          </div>
        </div>

        {/* STEPS */}
        <div className="hidden md:flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition
              ${
                step >= s
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white/10 text-gray-500"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* DOWNLOAD */}
        {html && step === 5 && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition px-5 py-3 rounded-2xl font-semibold"
          >
            {downloading
              ? "Generando PDF..."
              : "📄 Descargar PDF"}
          </button>
        )}
      </header>

      {/* SUCCESS */}
      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          ✅ CV generado correctamente
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* STEP 1 - TEMPLATE */}
        {step === 1 && (
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                ✨ Paso 1
              </div>

              <h2 className="text-5xl font-black mb-4">
                Elegí tu diseño
              </h2>

              <p className="text-gray-400 text-lg">
                Seleccioná el estilo visual para tu CV
              </p>
            </div>

            <TemplateSelector
              selected={style}
              onSelect={setStyle}
            />

            <div className="flex justify-center mt-10">
              <button
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 rounded-2xl font-bold hover:scale-105 transition shadow-2xl"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 - DATOS */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                👤 Paso 2
              </div>

              <h2 className="text-5xl font-black mb-4">
                Datos personales
              </h2>

              <p className="text-gray-400 text-lg">
                Completá tu información básica
              </p>
            </div>

            <CVForm
              step={2}
              setStep={setStep}
              onSubmit={handleGenerateWithSuccess}
              loading={loading}
            />

            <div className="flex justify-start mt-8">
              <button
                onClick={() => setStep(1)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-2xl transition"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - EXPERIENCIA Y EDUCACION */}
        {step === 3 && (
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                💼 Paso 3
              </div>

              <h2 className="text-5xl font-black mb-4">
                Experiencia y educación
              </h2>

              <p className="text-gray-400 text-lg">
                Agregá tu historial profesional
              </p>
            </div>

            <CVForm
              step={3}
              setStep={setStep}
              onSubmit={handleGenerateWithSuccess}
              loading={loading}
            />

            <div className="flex justify-start mt-8">
              <button
                onClick={() => setStep(2)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-2xl transition"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 - HABILIDADES */}
        {step === 4 && (
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                🛠️ Paso 4
              </div>

              <h2 className="text-5xl font-black mb-4">
                Habilidades y herramientas
              </h2>

              <p className="text-gray-400 text-lg">
                Agregá skills, tecnologías e idiomas
              </p>
            </div>

            <CVForm
              step={4}
              setStep={setStep}
              onSubmit={handleGenerateWithSuccess}
              loading={loading}
            />

            <div className="flex justify-start mt-8">
              <button
                onClick={() => setStep(3)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-2xl transition"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 - PREVIEW */}
        {step === 5 && (
          <div>

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-6">
                🚀 Paso 5
              </div>

              <h2 className="text-5xl font-black mb-4">
                Tu CV está listo
              </h2>

              <p className="text-gray-400 text-lg">
                Revisá tu diseño y exportalo en PDF
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8">
                <p className="text-red-300">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex justify-center">
                <PixelLoader />
              </div>
            )}

            {/* PREVIEW */}
            {!loading && html && (
              <div className="max-w-5xl mx-auto">

                <CVPreview html={html} />

                {/* PROMPT BAR */}
                <div className="mt-8">
                  <PromptBar
                    onEdit={handleEdit}
                    loading={loading}
                    disabled={!html}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-4 justify-center mt-10">

                  <button
                    onClick={() => setStep(4)}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-3 rounded-2xl transition"
                  >
                    ← Editar habilidades
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition"
                  >
                    📄 Descargar PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}