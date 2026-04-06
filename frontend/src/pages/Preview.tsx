import { useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const html = location.state?.html as string;

  if (!html) {
    navigate("/builder");
    return null;
  }

  function handleDownload() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-cv-skillara.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Skillara AI</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/builder")}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Volver al editor
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Descargar HTML
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <iframe
          srcDoc={html}
          className="w-full rounded-xl border border-gray-200 shadow-md"
          style={{ height: "900px" }}
          title="CV completo"
        />
      </div>
    </div>
  );
}