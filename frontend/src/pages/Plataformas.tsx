import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Globe, Sparkles, ExternalLink, TrendingUp, Bell
} from "lucide-react";
import Footer from "../components/Footer";

const plataformas = [
  { name: "Computrabajo", url: "https://sv.computrabajo.com", desc: "Líder en El Salvador. Miles de ofertas locales y centroamericanas.", tags: ["Local", "General"] },
  { name: "LinkedIn Jobs", url: "https://linkedin.com/jobs", desc: "Ideal para perfiles profesionales y corporativos. Networking activo.", tags: ["Corporativo", "Tech"] },
  { name: "Tecoloco", url: "https://www.tecoloco.com.sv", desc: "Fuerte presencia en retail, call centers y puestos operativos.", tags: ["Retail", "Servicios"] },
  { name: "Jooble", url: "https://sv.jooble.org", desc: "Agregador de ofertas. Busca en múltiples portales simultáneamente.", tags: ["Agregador", "Rápido"] },
  { name: "BuscoJobs", url: "https://www.buscojobs.com.sv", desc: "Buena opción para puestos administrativos y ventas.", tags: ["Admin", "Ventas"] },
  { name: "Bolsa de Trabajo MTPS", url: "https://bolsadetrabajo.gob.sv", desc: "Portal oficial del Ministerio de Trabajo. Vacantes verificadas.", tags: ["Oficial", "Seguro"] },
];

export default function Plataformas() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)", transform: "translate(20%, -20%)" }} />
      </div>

      <header className="sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:scale-110"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <ArrowLeft size={16} />
          </button>
          <img
              src="/images/logo.png"
              alt="Skillara AI"
              className="w-9 h-9 rounded-xl object-cover shadow-lg"
            />
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Plataformas de Empleo</span>
        </div>
        <button onClick={() => navigate("/builder")} className="btn-primary flex items-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles size={14} />Crear CV
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <Globe size={14} style={{ color: "var(--accent-1)" }} />
              Dónde buscar trabajo en El Salvador
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-5">
              Plataformas de <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Empleo</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Las mejores opciones para encontrar trabajo local, remoto o en la región centroamericana.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plataformas.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg group-hover:opacity-70 transition">{p.name}</h3>
                  <ExternalLink size={16} style={{ color: "var(--text-muted)" }} />
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
                      style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--accent-1)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <TrendingUp size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
              <div>
                <h3 className="font-bold mb-1">Estrategia multi-plataforma</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Las empresas salvadoreñas publican en 2-3 portales a la vez. No te limites a uno solo.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <Bell size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
              <div>
                <h3 className="font-bold mb-1">Alertas de correo</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Activá notificaciones en Computrabajo y LinkedIn para ser de los primeros en postularte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}