import { useNavigate } from "react-router-dom";
import {
  BrainCircuit, Palette, MessageSquareDiff, FileDown,
  ArrowRight, CheckCircle2, Zap, FileText, Sparkles,
  Moon, Sun, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const features = [
  {
    icon: BrainCircuit,
    title: "IA Inteligente",
    desc: "Tu CV se genera automáticamente con diseño y contenido optimizado para cada perfil.",
    bg: "rgba(79,123,255,0.12)",
    color: "#4f7bff",
  },
  {
    icon: Palette,
    title: "Plantillas Modernas",
    desc: "Elegí entre distintos estilos visuales profesionales hechos por diseñadores.",
    bg: "rgba(168,85,247,0.12)",
    color: "#a855f7",
  },
  {
    icon: MessageSquareDiff,
    title: "Edición con Prompts",
    desc: "Personalizá colores, estilos y textos escribiendo en lenguaje natural.",
    bg: "rgba(236,72,153,0.12)",
    color: "#ec4899",
  },
  {
    icon: FileDown,
    title: "Exportación Rápida",
    desc: "Descargá tu CV listo para enviar en PDF de alta calidad.",
    bg: "rgba(6,214,160,0.12)",
    color: "#06d6a0",
  },
];

const steps = [
  { number: "01", emoji: "🎨", title: "Elegí un diseño", desc: "Seleccioná el estilo que mejor te represente." },
  { number: "02", emoji: "📝", title: "Completá tus datos", desc: "Agregá experiencia, educación y habilidades." },
  { number: "03", emoji: "🧠", title: "La IA trabaja", desc: "Generamos un CV profesional automáticamente." },
  { number: "04", emoji: "⬇️", title: "Descargá y compartí", desc: "Exportalo en PDF y empezá a postularte." },
];

interface Props {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function Home({ dark, setDark }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const barTrack = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const statBg = dark ? "rgba(255,255,255,0.04)" : "#f8f8fc";
  const profileBg = dark ? "rgba(255,255,255,0.03)" : "#f4f4f8";
  const logoFeatureBorder = dark ? "rgba(79,123,255,0.2)" : "rgba(79,123,255,0.15)";
  const ghostBg = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const ghostBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const ghostColor = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const navBg = dark ? "rgba(10,12,20,0.92)" : "rgba(255,255,255,0.92)";
  const mobileMenuBg = dark ? "#0e1120" : "#ffffff";

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(79,123,255,0.5) 0%, transparent 65%)",
            transform: "translate(20%, -20%)",
            opacity: dark ? 0.2 : 0.08,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 65%)",
            transform: "translate(-20%, 20%)",
            opacity: dark ? 0.15 : 0.06,
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: navBg,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${cardBorder}`,
        }}
      >
        {/* Fila principal */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3">

          {/* Logo — siempre visible con texto */}
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo.png"
              alt="Skillara AI"
              className="w-8 h-8 rounded-xl object-cover"
            />
            <span
              className="text-base font-extrabold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Skillara <span style={{ opacity: 0.4 }}>AI</span>
            </span>
          </div>

          {/* Desktop actions (sm+) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
              title={dark ? "Modo claro" : "Modo oscuro"}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-medium transition-all"
                  style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: "var(--text)" }}
                >
                  <FileText size={14} />
                  Mis CVs
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-medium transition-all"
                  style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl font-medium transition-all"
                style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: "var(--text)" }}
              >
                Iniciar sesión
              </button>
            )}

            <button
              onClick={() => navigate("/builder")}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #4f7bff, #a855f7)",
                boxShadow: "0 4px 16px rgba(79,123,255,0.35)",
              }}
            >
              <Zap size={13} />
              Crear CV
            </button>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            className="sm:hidden px-4 pb-4 flex flex-col gap-2"
            style={{ background: mobileMenuBg, borderTop: `1px solid ${cardBorder}` }}
          >
            {user ? (
              <>
                <button
                  onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl font-medium text-left"
                  style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: "var(--text)" }}
                >
                  <FileText size={15} />
                  Mis CVs
                </button>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl font-medium text-left"
                  style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl font-medium text-left"
                style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: "var(--text)" }}
              >
                Iniciar sesión
              </button>
            )}
            <button
              onClick={() => { navigate("/builder"); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #4f7bff, #a855f7)",
                boxShadow: "0 4px 16px rgba(79,123,255,0.3)",
              }}
            >
              <Zap size={14} />
              Crear CV
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-12 sm:pt-20 pb-16 sm:pb-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* LEFT */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(79,123,255,0.1)",
                border: "1px solid rgba(79,123,255,0.25)",
                color: "#5b8aff",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4f7bff" }} />
              Gratis · IA integrada · Sin registro
            </div>

            <h1
              className="font-black leading-[1.02] mb-5"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 3.7rem)",
                letterSpacing: "-2px",
              }}
            >
              Creá tu CV con{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4f7bff, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Inteligencia Artificial
              </span>
            </h1>

            <p
              className="leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--text-muted)", fontSize: "clamp(14px, 2vw, 17px)" }}
            >
              Diseños modernos, generación automática y personalización inteligente.
              Todo listo en minutos, sin esfuerzo.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => navigate("/builder")}
                className="flex items-center gap-2 text-white font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                  background: "linear-gradient(135deg, #4f7bff, #a855f7)",
                  boxShadow: "0 6px 28px rgba(79,123,255,0.4)",
                }}
              >
                Empezar ahora
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <CheckCircle2 size={16} color="#06d6a0" />
                100% gratuito
              </div>
            </div>
          </div>

          {/* RIGHT — MOCKUP CARD */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #4f7bff, #a855f7)",
                opacity: dark ? 0.2 : 0.08,
              }}
            />
            <div
              className="relative rounded-3xl p-5 sm:p-7 shadow-xl"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: "blur(10px)" }}
            >
              {/* Logo feature highlight */}
              <div
                className="flex items-center gap-3 mb-5 p-3.5 rounded-2xl"
                style={{
                  background: dark
                    ? "linear-gradient(135deg, rgba(79,123,255,0.08), rgba(168,85,247,0.08))"
                    : "linear-gradient(135deg, rgba(79,123,255,0.06), rgba(168,85,247,0.06))",
                  border: `1px solid ${logoFeatureBorder}`,
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="Skillara AI"
                  className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Skillara AI
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)", marginTop: 2 }}>
                    CV generado con IA
                  </p>
                </div>
                <div
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(6,214,160,0.1)", color: "#059669", border: "1px solid rgba(6,214,160,0.25)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#06d6a0" }} />
                  Generado
                </div>
              </div>

              {/* Profile row */}
              <div
                className="flex items-center gap-3 mb-5 p-3 rounded-xl"
                style={{ background: profileBg, border: `1px solid ${cardBorder}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4f7bff, #a855f7)", fontFamily: "'Syne', sans-serif" }}
                >
                  J
                </div>
                <div>
                  <p className="font-semibold text-sm">Juan Pérez</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Frontend Developer</p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 mb-5">
                {["Experiencia", "Educación", "Habilidades", "Proyectos"].map((item, i) => (
                  <div key={item}>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      <span>{item}</span>
                      <span className="font-semibold" style={{ color: "var(--text)" }}>
                        {[92, 88, 95, 85][i]}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: barTrack }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${[92, 88, 95, 85][i]}%`, background: "linear-gradient(90deg, #4f7bff, #a855f7)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "4", l: "Diseños", extraStyle: {} },
                  { v: "PDF", l: "Exportación", extraStyle: { background: "linear-gradient(135deg,#4f7bff,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } },
                  { v: "IA", l: "Generado", extraStyle: { color: "#059669" } },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-xl p-3 text-center"
                    style={{ background: statBg, border: `1px solid ${cardBorder}` }}
                  >
                    <p className="text-lg font-black" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px", ...s.extraStyle }}>
                      {s.v}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-14 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase mb-3" style={{ color: "#4f7bff", letterSpacing: "3px" }}>
              Características
            </p>
            <h2
              className="font-black tracking-tight mb-3"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-1.5px" }}
            >
              Todo lo que necesitás
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "clamp(14px, 2vw, 16px)" }}>
              Herramientas modernas para crear un CV impactante.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.bg, color: f.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pb-16 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl sm:rounded-[40px] p-7 sm:p-10 lg:p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a2a6e, #4a1a8e)" }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}
            />
            <div className="relative z-10 text-center mb-8 sm:mb-14">
              <p className="text-xs font-bold uppercase text-blue-200 mb-3" style={{ letterSpacing: "3px" }}>
                Proceso
              </p>
              <h2
                className="font-black mb-3 text-white"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-1.5px" }}
              >
                ¿Cómo funciona?
              </h2>
              <p className="text-blue-100" style={{ fontSize: "clamp(14px, 2vw, 17px)" }}>
                En menos de 2 minutos tendrás tu CV listo.
              </p>
            </div>

            <div className="relative z-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl p-4 sm:p-6 border transition-colors hover:bg-white/[0.13]"
                  style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      {step.emoji}
                    </div>
                    <span
                      className="font-black"
                      style={{ fontSize: "26px", color: "rgba(255,255,255,0.15)", fontFamily: "'Syne', sans-serif", letterSpacing: "-1px" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 py-14 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <img
            src="/images/logo.png"
            alt="Skillara AI"
            className="w-16 h-16 rounded-2xl object-cover mx-auto mb-6"
          />
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: ghostBg, border: `1px solid ${ghostBorder}`, color: ghostColor }}
          >
            <Sparkles size={11} style={{ color: "#a855f7" }} />
            Sin tarjeta · Sin registro
          </div>

          <h2
            className="font-black tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-2px", lineHeight: "1.02" }}
          >
            Empezá gratis hoy
          </h2>

          <p className="mb-8 leading-relaxed" style={{ color: "var(--text-muted)", fontSize: "clamp(15px, 2vw, 17px)" }}>
            Creá un CV profesional con IA y destacate entre cientos de candidatos.
          </p>

          <button
            onClick={() => navigate("/builder")}
            className="inline-flex items-center gap-2 text-white font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
            style={{ padding: "13px 30px", fontSize: "15px", background: "linear-gradient(135deg, #4f7bff, #a855f7)", boxShadow: "0 8px 32px rgba(79,123,255,0.45)" }}
          >
            Crear mi CV
            <ArrowRight size={17} />
          </button>

          <p className="mt-5 text-xs" style={{ color: "var(--text-muted)" }}>
            Más de 1,000 CVs generados esta semana ✦
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}