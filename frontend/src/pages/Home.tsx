import { useNavigate } from "react-router-dom";
import {
  BrainCircuit, Palette, MessageSquareDiff, FileDown,
  Sun, Moon, ArrowRight, CheckCircle2, Zap, Star,
  Code2, Send, Link, Sparkles, FileText
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "IA Inteligente",
    desc: "Tu CV se genera automáticamente con diseño y contenido optimizado para cada perfil.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Palette,
    title: "Plantillas Modernas",
    desc: "Elegí entre distintos estilos visuales profesionales hechos por diseñadores.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: MessageSquareDiff,
    title: "Edición con Prompts",
    desc: "Personalizá colores, estilos y textos escribiendo en lenguaje natural.",
    color: "from-pink-500 to-rose-400",
  },
  {
    icon: FileDown,
    title: "Exportación Rápida",
    desc: "Descargá tu CV listo para enviar en PDF de alta calidad.",
    color: "from-emerald-500 to-teal-400",
  },
];

const steps = [
  { number: "01", icon: Palette, title: "Elegí un diseño", desc: "Seleccioná el estilo que mejor te represente." },
  { number: "02", icon: FileText, title: "Completá tus datos", desc: "Agregá experiencia, educación y habilidades." },
  { number: "03", icon: BrainCircuit, title: "La IA trabaja", desc: "Generamos un CV profesional automáticamente." },
  { number: "04", icon: FileDown, title: "Descargá y compartí", desc: "Exportalo en PDF y empezá a postularte." },
];

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function Home({ dark, setDark }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)", transform: "translate(20%, -20%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--glow-2), transparent 70%)", transform: "translate(-20%, 20%)" }} />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
            S
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Skillara <span className="opacity-50">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={() => navigate("/builder")}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Zap size={15} />
            Crear CV
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 lg:px-16 pt-20 pb-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <Star size={13} style={{ color: "var(--accent-1)" }} />
              Gratis · IA integrada · Sin registro
            </div>

            <h1 className="text-5xl lg:text-[4rem] font-black leading-[1.05] mb-6 tracking-tight">
              Creá un CV moderno con{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>

            <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: "var(--text-muted)" }}>
              Diseños modernos, generación automática y personalización inteligente.
              Todo listo en minutos.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate("/builder")}
                className="btn-primary flex items-center gap-2"
              >
                Empezar ahora
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <CheckCircle2 size={16} style={{ color: "#10b981" }} />
                100% gratuito
              </div>
            </div>
          </div>

          {/* RIGHT — MOCKUP CARD */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
              style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }} />

            <div className="relative glass-card rounded-3xl p-7 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow"
                  style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>J</div>
                <div>
                  <h3 className="font-bold">Juan Pérez</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Frontend Developer</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                  <CheckCircle2 size={12} /> Generado
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {["Experiencia", "Educación", "Habilidades", "Proyectos"].map((item, i) => (
                  <div key={item}>
                    <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                      <span>{item}</span>
                      <span className="font-semibold" style={{ color: "var(--text)" }}>{[92, 88, 95, 85][i]}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${[92, 88, 95, 85][i]}%`, background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[{ v: "4", l: "Diseños" }, { v: "PDF", l: "Exportación" }, { v: "IA", l: "Generado" }].map((s) => (
                  <div key={s.l} className="rounded-2xl p-4 text-center" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                    <p className="text-xl font-black">{s.v}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent-1)" }}>
              Características
            </p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Todo lo que necesitás
            </h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Herramientas modernas para crear un CV impactante.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 text-white shadow-lg`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[40px] p-10 lg:p-16 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

            <div className="relative z-10 text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200 mb-3">Proceso</p>
              <h2 className="text-4xl lg:text-5xl font-black mb-4">¿Cómo funciona?</h2>
              <p className="text-blue-100 text-lg">En menos de 2 minutos tendrás tu CV listo.</p>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="bg-white/10 rounded-3xl p-6 border border-white/15 hover:bg-white/15 transition">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <span className="text-3xl font-black text-white/20">{step.number}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <Sparkles size={13} style={{ color: "var(--accent-2)" }} />
            Sin tarjeta · Sin registro
          </div>

          <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Empezá gratis hoy
          </h2>

          <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
            Creá un CV profesional con IA y destacate entre cientos de candidatos.
          </p>

          <button
            onClick={() => navigate("/builder")}
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            Crear mi CV
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-8 border-t flex flex-col lg:flex-row items-center justify-between gap-4"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>S</div>
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Skillara AI © 2026</span>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Plataforma universitaria impulsada con Inteligencia Artificial
        </p>

        <div className="flex items-center gap-3">
          {[Code2, Send, Link].map((Icon, i) => (
            <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:scale-110"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
