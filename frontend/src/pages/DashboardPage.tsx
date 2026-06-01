import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, Download, Plus, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserCVs, deleteCV } from "./services/cvStorage";
import type { SavedCV } from "./services/cvStorage";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem("skillara-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("skillara-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!user) return;
    getUserCVs(user.uid)
      .then(setCvs)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (cvId: string) => {
    if (!user) return;
    if (!confirm("¿Eliminar este CV?")) return;
    await deleteCV(user.uid, cvId);
    setCvs((prev) => prev.filter((c) => c.id !== cvId));
  };

  const handleDownload = (html: string, title: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
            S
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skillara <span className="opacity-50">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm hidden md:block" style={{ color: "var(--text-muted)" }}>
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-semibold transition hover:scale-105"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <LogOut size={15} />
            Salir
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black mb-1">Mis CVs</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {cvs.length === 0 ? "Aún no tenés CVs guardados" : `${cvs.length} CV${cvs.length > 1 ? "s" : ""} guardado${cvs.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => navigate("/builder")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Nuevo CV
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent-1)" }} />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && cvs.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
              <FileText size={36} style={{ color: "var(--text-muted)" }} />
            </div>
            <h2 className="text-xl font-bold mb-2">No tenés CVs todavía</h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Creá tu primer CV con IA y guardalo aquí.
            </p>
            <button
              onClick={() => navigate("/builder")}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Crear mi primer CV
            </button>
          </div>
        )}

        {/* CV GRID */}
        {!loading && cvs.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {cvs.map((cv) => (
              <div key={cv.id} className="glass-card rounded-3xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow"
                    style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                    {cv.title?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{cv.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {cv.createdAt
                        ? new Date((cv.createdAt as any)?.seconds * 1000).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "Fecha desconocida"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleDownload(cv.html, cv.title)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl font-semibold transition hover:scale-105"
                    style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <Download size={14} />
                    Descargar
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition hover:scale-105"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}