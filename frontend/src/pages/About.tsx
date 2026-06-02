// src/pages/About.tsx
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Users, Heart, Code2, Target,
  Zap, Mail, MapPin, ExternalLink, ChevronRight
} from "lucide-react";
import Footer from "../components/Footer";

const teamMembers = [
  { github: "ViviLeech", name: "Vivian", role: "Frontend & UX" },
  { github: "luisamaya1518-rgb", name: "Luis", role: "Backend & DevOps" },
  { github: "eun-mar", name: "Eunice", role: "IA & Prompt Engineering" },
  { github: "taniagochez", name: "Tania", role: "Diseño & Research" },
  { github: "CristianParadaLopez", name: "Cristian", role: "Lead Developer" },
];

const valores = [
  { icon: Target, title: "Accesibilidad", desc: "Creemos que la tecnología debe servir para reducir brechas, no ampliarlas. Por eso Skillara es 100% gratuito." },
  { icon: Zap, title: "IA con propósito", desc: "Usamos Inteligencia Artificial para automatizar lo tedioso, no para reemplazar el criterio humano." },
  { icon: Code2, title: "Código abierto", desc: "Nuestro proyecto es open source. Cualquiera puede auditar, mejorar o aprender de nuestro código." },
  { icon: Heart, title: "Hecho en El Salvador", desc: "Diseñado pensando en el mercado laboral centroamericano: formatos, leyes y plataformas locales." },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* BG GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--glow-1), transparent 70%)", transform: "translate(20%, -20%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--glow-2), transparent 70%)", transform: "translate(-20%, 20%)" }} />
      </div>

      {/* HEADER */}
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
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Sobre Skillara</span>
        </div>
        <button onClick={() => navigate("/builder")}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles size={14} />Crear CV
        </button>
      </header>

      <main className="relative z-10 flex-1">
        {/* SOBRE SKILLARA */}
        <section id="about" className="px-6 lg:px-16 pt-16 pb-12 scroll-mt-24">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
              Skillara <span className="opacity-50">AI</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Somos un equipo de estudiantes de ingeniería de software de El Salvador que decidió 
              resolver un problema real: <strong>crear un CV profesional en Latinoamérica es difícil, caro y lento.</strong>
              Skillara AI nació para democratizar el acceso a herramientas de calidad profesional 
              usando Inteligencia Artificial y diseño moderno.
            </p>
          </div>
        </section>

        {/* VALORES */}
        <section className="px-6 lg:px-16 py-12">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valores.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold mb-2">{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TECNOLOGÍA */}
        <section className="px-6 lg:px-16 py-12">
          <div className="max-w-4xl mx-auto rounded-[40px] p-10 lg:p-14 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-black mb-4">Tecnología moderna, código limpio</h2>
                <p className="text-blue-100 mb-6">
                  Usamos React, TypeScript, Tailwind CSS y modelos de IA para generar CVs que cumplen 
                  estándares internacionales y superan filtros ATS.
                </p>
                <a href="https://github.com/CristianParadaLopez/cv-builder" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 transition px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <Code2  size={16} /> Ver en GitHub <ExternalLink size={14} />
                </a>
              </div>
              <div className="space-y-3">
                {["React 19 + TypeScript", "Tailwind CSS + Variables CSS", "IA Generativa (LLM)", "Exportación PDF nativa", "Diseño responsive & dark mode"].map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/15">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <span className="text-sm font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPO */}
        <section id="equipo" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
              <Users size={14} className="inline mr-1" />
              Nuestro Equipo
            </p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
              Quienes construyen Skillara
            </h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>
              Estudiantes apasionados por el código, el diseño y el impacto social.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {teamMembers.map((member) => (
              <a key={member.github}
                href={`https://github.com/${member.github}`}
                target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-all duration-300 group">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-[var(--border)] group-hover:ring-[var(--accent-1)] transition">
                  <img src={`https://unavatar.io/github/${member.github}`} alt={member.name}
                    className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{member.role}</p>
                <div className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  <Code2 size={12} /> @{member.github}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                Contacto
              </p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
                Hablemos
              </h2>
              <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                ¿Tenés feedback, ideas o querés colaborar? Estamos abiertos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-10">
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                  <Mail size={18} />
                </div>
                <h3 className="font-bold text-sm mb-1">Email</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>skillara.ai@gmail.com</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                  <MapPin size={18} />
                </div>
                <h3 className="font-bold text-sm mb-1">Ubicación</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>San Salvador, El Salvador</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                  <Code2 size={18} />
                </div>
                <h3 className="font-bold text-sm mb-1">GitHub</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Open source</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 lg:p-8">
              <form onSubmit={(e) => { e.preventDefault(); alert("Gracias por tu mensaje. Te responderemos pronto."); }}
                className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Nombre</label>
                    <input type="text" required placeholder="Tu nombre"
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                      style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                    <input type="email" required placeholder="correo@ejemplo.com"
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                      style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Mensaje</label>
                  <textarea required rows={4} placeholder="¿En qué podemos ayudarte?"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                    style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  Enviar mensaje <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-5">
              Sumate al proyecto
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
              Si querés contribuir código, reportar bugs o sugerir features, 
              abrí un issue en GitHub o escribinos por correo.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate("/builder")}
                className="btn-primary inline-flex items-center gap-2">
                <Sparkles size={16} /> Probar Skillara
              </button>
              <a href="https://github.com/CristianParadaLopez/cv-builder" target="_blank" rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2">
                <Code2 size={16} /> Ver código
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}