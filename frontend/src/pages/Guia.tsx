// src/pages/Guia.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Shield, Briefcase, HelpCircle,
  ChevronRight, Globe, FileCheck, AlertTriangle, Clock,
  BookOpen, CheckCircle2, Sparkles, Mail, MapPin, Phone
} from "lucide-react";
import Footer from "../components/Footer";

const atsFeatures = [
  { icon: Search, title: "Filtrado por palabras clave", desc: "El ATS escanea tu CV buscando términos exactos del puesto: herramientas, certificaciones y skills." },
  { icon: FileCheck, title: "Parsing automático", desc: "Convierte tu PDF en datos estructurados. Si el formato es confuso, la información se pierde." },
  { icon: Clock, title: "Ranking de candidatos", desc: "Puntúa automáticamente según compatibilidad. Un CV optimizado puede colocarte en el top 10%." },
  { icon: AlertTriangle, title: "Preguntas eliminatorias", desc: "Knockout questions filtran antes de que un humano revise. Responder mal = descarte automático." },
];

const plataformas = [
  { name: "Computrabajo", url: "https://sv.computrabajo.com", desc: "Líder en El Salvador. Miles de ofertas locales y centroamericanas.", tags: ["Local", "General"] },
  { name: "LinkedIn", url: "https://linkedin.com/jobs", desc: "Ideal para perfiles profesionales y corporativos. Networking activo.", tags: ["Corporativo", "Tech"] },
  { name: "Tecoloco", url: "https://www.tecoloco.com.sv", desc: "Portal clásico con fuerte presencia en retail, call centers y operativos.", tags: ["Retail", "Servicios"] },
  { name: "Jooble", url: "https://sv.jooble.org", desc: "Agregador de ofertas. Busca en múltiples portales simultáneamente.", tags: ["Agregador", "Rápido"] },
  { name: "BuscoJobs", url: "https://www.buscojobs.com.sv", desc: "Buena opción para puestos administrativos y ventas.", tags: ["Admin", "Ventas"] },
  { name: "Bolsa de Trabajo Gobierno", url: "https://bolsadetrabajo.gob.sv", desc: "Portal oficial del Ministerio de Trabajo. Vacantes verificadas.", tags: ["Oficial", "Seguro"] },
];

const derechos = [
  { art: "Art. 58", title: "Indemnización por despido injustificado", desc: "30 días de salario por cada año de servicio si te despiden sin causa legal (Art. 50). Mínimo 15 días." },
  { art: "Art. 177", title: "Vacaciones anuales", desc: "15 días pagados + 30% de recargo después de 1 año continuo de trabajo. Es un derecho, no un favor." },
  { art: "Art. 196", title: "Aguinaldo / Prima anual", desc: "10 días (1-3 años), 15 días (3-10 años), 21 días (10+ años). Se paga entre 20 oct y 20 dic." },
  { art: "Art. 308-A", title: "Protección por enfermedad crónica", desc: "No pueden despedirte si padeces cáncer, diabetes, VIH, insuficiencia renal, etc. Protección desde diagnóstico hasta 3 meses post-tratamiento." },
  { art: "Art. 4", title: "Derechos irrenunciables", desc: "Ninguna cláusula de contrato puede obligarte a renunciar a tus derechos laborales. Es nula de pleno derecho." },
  { art: "Art. 19", title: "Presunción laboral", desc: "Si trabajaste 2+ días para alguien, existe relación laboral aunque no haya contrato escrito." },
];

const faqs = [
  { q: "¿Skillara AI guarda mis datos personales?", a: "No. Tu información se procesa en tiempo real para generar el CV. No almacenamos bases de datos de usuarios ni vendemos información a terceros." },
  { q: "¿El CV generado sirve para aplicar a empresas con ATS?", a: "Sí. Nuestras plantillas priorizan legibilidad para parsers de ATS: estructura clara, keywords relevantes y formato estándar que no confunde los algoritmos de escaneo." },
  { q: "¿Puedo usar el CV para trabajos en el extranjero?", a: "Absolutamente. Las plantillas siguen estándares internacionales (Europa, USA, Canadá). Solo ajustá el idioma y las referencias según el país destino." },
  { q: "¿Es realmente gratis?", a: "Sí. Skillara AI es un proyecto universitario sin fines de lucro. Podés generar, editar y descargar tu CV sin pagar ni registrar tarjeta." },
  { q: "¿Qué pasa si no tengo experiencia laboral?", a: "La IA destaca tus proyectos académicos, prácticas, voluntariados y habilidades transferibles. Un CV sólido no requiere 10 años de experiencia." },
  { q: "¿Cómo optimizo mi CV para un ATS específico?", a: "Usá el texto exacto de la oferta laboral en tu CV: si piden 'React Native', no escribas solo 'React'. Incluí certificaciones exactas y evitá tablas, columnas y gráficos que los parsers no leen bien." },
];

export default function Guia() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

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
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Guía Profesional</span>
        </div>
        <button onClick={() => navigate("/builder")}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles size={14} />Crear CV
        </button>
      </header>

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="px-6 lg:px-16 pt-16 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <BookOpen size={14} style={{ color: "var(--accent-1)" }} />
              Recursos para tu carrera
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-5">
              Todo lo que necesitás para{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                conseguir empleo
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Guía práctica basada en el mercado laboral de El Salvador y Centroamérica. 
              Optimizá tu CV, entendé los filtros de las empresas y conocé tus derechos.
            </p>
          </div>
        </section>

        {/* ¿QUÉ ES UN ATS? */}
        <section id="ats" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                  Tecnología de Reclutamiento
                </p>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-5">
                  ¿Qué es un ATS y por qué debería importarte?
                </h2>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  Un <strong>Applicant Tracking System (ATS)</strong> es el software que usan el 75% de las empresas 
                  medianas y grandes en Latinoamérica para filtrar currículums. 
                  Cuando enviás tu CV, el ATS lo escanea <em>antes</em> de que un humano lo vea.
                  Si no está optimizado, ni siquiera llega al reclutador.
                </p>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  En El Salvador, empresas como Grupo Centra, Banco Agrícola y multinationales de Zona Franca 
                  usan sistemas como <strong>Evaluar, Workday o Greenhouse</strong> para gestionar miles de postulaciones.
                  Un CV con tablas, gráficos o fuentes raras puede ser rechazado automáticamente por el parser.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    75% de empresas lo usan
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    Reduce tiempo de hiring 40%
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {atsFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="glass-card rounded-2xl p-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                        style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                        <Icon size={18} />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIPS BOX */}
            <div className="mt-12 rounded-2xl p-6 lg:p-8 border"
              style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(109,40,217,0.08))", borderColor: "var(--border)" }}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Cómo vencer al ATS con tu CV
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Usá el mismo vocabulario de la oferta laboral (keywords exactos).",
                  "Evitá tablas, columnas, gráficos y headers/footers complejos.",
                  "Guardá en PDF estándar (no escaneado ni con capas de imagen).",
                  "Incluí secciones claras: Experiencia, Educación, Habilidades.",
                  "No uses fotos ni elementos decorativos que confundan el parser.",
                  "Revisá con un simulador de ATS online antes de enviar."
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <ChevronRight size={14} className="mt-0.5 shrink-0 text-blue-400" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PLATAFORMAS DE EMPLEO */}
        <section id="plataformas" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                Dónde buscar
              </p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
                Plataformas de Empleo en El Salvador
              </h2>
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
                    <Globe size={16} style={{ color: "var(--text-muted)" }} />
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

            <div className="mt-10 rounded-2xl p-6 border text-center"
              style={{ background: "var(--bg-card2)", borderColor: "var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                <strong>Tip:</strong> No te limites a una sola plataforma. 
                Las empresas salvadoreñas suelen publicar en 2-3 portales simultáneamente. 
                Activá alertas de correo en Computrabajo y LinkedIn para no perderte ofertas nuevas.
              </p>
            </div>
          </div>
        </section>

        {/* SEGURIDAD LABORAL */}
        <section id="seguridad" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                Conocé tus derechos
              </p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
                Seguridad Laboral en El Salvador
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
                Código de Trabajo 2026: artículos clave que todo trabajador debe conocer antes de firmar un contrato.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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

            <div className="mt-10 rounded-2xl p-6 lg:p-8 border"
              style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.15)" }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                Red flags en contratos de trabajo
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>Cláusulas que te obligan a renunciar a indemnización (son nulas por el Art. 4).</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>Contratos por "prueba" de más de 30 días sin especificar condiciones de pago.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>Que no te registren en ISSS y AFP desde el primer día (obligación del Art. 29).</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-red-400" />
                  <span>Jornadas de más de 44 horas semanales sin pago de horas extras (Art. 155-176).</span>
                </li>
              </ul>
              <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                Fuente: Código de Trabajo de El Salvador, reforma 2026. 
                Para denuncias: <a href="https://www.mtps.gob.sv" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition">Ministerio de Trabajo (MTPS)</a>.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 lg:px-16 py-16 scroll-mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                Preguntas Frecuentes
              </p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">
                Resolvemos tus dudas
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                      <HelpCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{faq.q}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-5">
              Listo para aplicar todo esto?
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
              Generá un CV optimizado para ATS en menos de 2 minutos y empezá a postularte hoy.
            </p>
            <button onClick={() => navigate("/builder")}
              className="btn-primary inline-flex items-center gap-2 text-lg">
              Crear mi CV ahora <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}