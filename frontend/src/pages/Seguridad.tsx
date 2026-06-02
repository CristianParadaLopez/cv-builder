import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Shield, AlertTriangle, ChevronRight, Sparkles, Scale
} from "lucide-react";
import Footer from "../components/Footer";

const derechos = [
  { art: "Art. 58", title: "Indemnización por despido injustificado", desc: "30 días de salario por cada año de servicio. Mínimo 15 días si te despiden sin causa legal (Art. 50)." },
  { art: "Art. 177", title: "Vacaciones anuales", desc: "15 días pagados + 30% de recargo después de 1 año continuo de trabajo." },
  { art: "Art. 196", title: "Aguinaldo / Prima anual", desc: "10 días (1-3 años), 15 días (3-10 años), 21 días (10+ años). Se paga entre 20 oct y 20 dic." },
  { art: "Art. 308-A", title: "Protección por enfermedad crónica", desc: "No pueden despedirte si padecés cáncer, diabetes, VIH, insuficiencia renal, etc. Protección desde diagnóstico hasta 3 meses post-tratamiento." },
  { art: "Art. 4", title: "Derechos irrenunciables", desc: "Ninguna cláusula puede obligarte a renunciar a tus derechos laborales. Es nula de pleno derecho." },
  { art: "Art. 19", title: "Presunción laboral", desc: "Si trabajaste 2+ días para alguien, existe relación laboral aunque no haya contrato escrito." },
];

const redFlags = [
  "Cláusulas que te obligan a renunciar a indemnización (son nulas por el Art. 4).",
  "Contratos por 'prueba' de más de 30 días sin especificar condiciones de pago.",
  "Que no te registren en ISSS y AFP desde el primer día (obligación del Art. 29).",
  "Jornadas de más de 44 horas semanales sin pago de horas extras (Art. 155-176).",
];

export default function Seguridad() {
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
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Seguridad Laboral</span>
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
              <Scale size={14} style={{ color: "var(--accent-1)" }} />
              Conocé tus derechos
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-5">
              Seguridad <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Laboral</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Código de Trabajo 2026: artículos clave que todo trabajador debe conocer antes de firmar un contrato.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {derechos.map((d) => (
              <div key={d.art} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                    {d.art}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{d.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 lg:p-8 border"
            style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.15)" }}>
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2 text-red-400">
              <AlertTriangle size={20} />
              Red flags en contratos de trabajo
            </h2>
            <ul className="space-y-3">
              {redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
              Fuente: Código de Trabajo de El Salvador, reforma 2026. 
              Para denuncias: <a href="https://www.mtps.gob.sv" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition">Ministerio de Trabajo (MTPS)</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}