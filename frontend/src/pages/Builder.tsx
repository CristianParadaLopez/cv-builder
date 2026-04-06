import { useState } from "react";
import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import PixelLoader from "../components/PixelLoader";
import PromptBar from "../components/PromptBar";
import TemplateSelector from "../components/TemplateSelector";
import { useCV } from "../pages/hooks/useCV";


export default function Builder() {
  const { html, loading, error, style, setStyle, handleGenerate, handleEdit } = useCV();
  const [success, setSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleGenerateWithSuccess(formData: any) {
    await handleGenerate(formData);
    setSuccess(true);
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
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Skillara AI</h1>
          <span className="text-sm text-gray-400 ml-2 hidden md:block">Generador de CV con IA</span>
        </div>
        {html && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <span className="animate-spin">⏳</span> Generando PDF...
              </>
            ) : (
              <>📄 Descargar PDF</>
            )}
          </button>
        )}
      </header>

      {/* SUCCESS TOAST */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <span>✅</span>
          <span className="font-semibold">¡CV generado exitosamente!</span>
        </div>
      )}

      {/* MAIN */}
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">

        {/* FORMULARIO */}
        <div className="w-1/2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Tu información</h2>
          <TemplateSelector selected={style} onSelect={setStyle} />
          <CVForm onSubmit={handleGenerateWithSuccess} loading={loading} />
        </div>

        {/* PREVIEW */}
        <div className="w-1/2 sticky top-20" style={{ height: "calc(100vh - 100px)" }}>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Vista previa</h2>

          {loading && <PixelLoader />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
              <p className="text-red-600 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {!loading && html && <CVPreview html={html} />}

          {!loading && !html && (
            <div className="flex flex-col items-center justify-center h-72 bg-white rounded-xl border-2 border-dashed border-gray-200 gap-4">
              <div className="text-5xl">📄</div>
              <p className="text-gray-500 text-sm font-medium">Elegí un estilo y completá tu información</p>
              <p className="text-gray-300 text-xs">Tu CV aparecerá aquí en segundos</p>
            </div>
          )}

          {html && !loading && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2 text-center">
                💬 Escribí un prompt para editar el diseño
              </p>
              <PromptBar onEdit={handleEdit} loading={loading} disabled={!html} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}