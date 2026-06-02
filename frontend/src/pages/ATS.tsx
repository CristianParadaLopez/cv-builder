import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, FileCheck, Clock, AlertTriangle,
  CheckCircle2, ChevronRight, Sparkles, BarChart3, Eye
} from "lucide-react";
import Footer from "../components/Footer";

const features = [
  { icon: Search, title: "Filtrado por keywords", desc: "Escanea palabras exactas del puesto. Si no coinciden, el CV ni se abre." },
  { icon: FileCheck, title: "Parsing estructurado", desc: "Convierte PDFs en datos organizados. Formatos raros = información perdida." },
  { icon: Clock, title: "Ranking automático", desc: "Puntúa candidatos según compatibilidad. Un CV optimizado te coloca en el top 10%." },
  { icon: AlertTriangle, title: "Knockout questions", desc: "Preguntas eliminatorias que descartan automáticamente si fallás." },
];

const tips = [
  "Usá el mismo vocabulario de la oferta: si piden 'React Native', no escribas solo 'React'.",
  "Evitá tablas, columnas, gráficos y headers/footers complejos.",
  "Guardá en PDF estándar (no escaneado ni con capas de imagen).",
  "Incluí secciones claras: Experiencia, Educación, Habilidades.",
  "No uses fotos ni elementos decorativos que confundan el parser.",
  "Revisá con un simulador de ATS online antes de enviar."
];

export default function ATS() {
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
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>¿Qué es un ATS?</span>
        </div>
        <button onClick={() => navigate("/builder")} className="btn-primary flex items-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles size={14} />Crear CV
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <BarChart3 size={14} style={{ color: "var(--accent-1)" }} />
              Tecnología de Reclutamiento
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-5">
              ¿Qué es un{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">ATS</span>?
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Un <strong>Applicant Tracking System</strong> es el software que usan el 75% de las empresas 
              medianas y grandes en Latinoamérica para filtrar currículums. 
              Cuando enviás tu CV, el ATS lo escanea <em>antes</em> de que un humano lo vea.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                    style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl p-6 lg:p-8 border mb-12"
            style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(109,40,217,0.08))", borderColor: "var(--border)" }}>
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Cómo vencer al ATS con tu CV
            </h2>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>{i + 1}</div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
            <Eye size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
            <div>
              <h3 className="font-bold mb-2">¿Sabías que...?</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                En El Salvador, empresas como Grupo Centra, Banco Agrícola y maquiladoras de Zona Franca 
                usan sistemas como <strong>Evaluar, Workday o Greenhouse</strong>. Un CV con tablas o fuentes decorativas 
                puede ser rechazado automáticamente antes de que un reclutador lo vea.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}