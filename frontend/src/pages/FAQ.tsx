import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, HelpCircle, Sparkles, CheckCircle2, FileText, Lock
} from "lucide-react";
import Footer from "../components/Footer";

const faqs = [
  { q: "¿Skillara AI guarda mis datos personales?", a: "No. Tu información se procesa en tiempo real para generar el CV. No almacenamos bases de datos de usuarios ni vendemos información a terceros." },
  { q: "¿El CV generado sirve para aplicar a empresas con ATS?", a: "Sí. Nuestras plantillas priorizan legibilidad para parsers de ATS: estructura clara, keywords relevantes y formato estándar que no confunde los algoritmos de escaneo." },
  { q: "¿Puedo usar el CV para trabajos en el extranjero?", a: "Absolutamente. Las plantillas siguen estándares internacionales (Europa, USA, Canadá). Solo ajustá el idioma y las referencias según el país destino." },
  { q: "¿Es realmente gratis?", a: "Sí. Skillara AI es un proyecto universitario sin fines de lucro. Podés generar, editar y descargar tu CV sin pagar ni registrar tarjeta." },
  { q: "¿Qué pasa si no tengo experiencia laboral?", a: "La IA destaca tus proyectos académicos, prácticas, voluntariados y habilidades transferibles. Un CV sólido no requiere 10 años de experiencia." },
  { q: "¿Cómo optimizo mi CV para un ATS específico?", a: "Usá el texto exacto de la oferta laboral en tu CV: si piden 'React Native', no escribas solo 'React'. Incluí certificaciones exactas y evitá tablas, columnas y gráficos que los parsers no leen bien." },
];

export default function FAQ() {
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
          <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Preguntas Frecuentes</span>
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
              <HelpCircle size={14} style={{ color: "var(--accent-1)" }} />
              Resolvemos tus dudas
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-5">
              Preguntas <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Frecuentes</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Todo lo que necesitás saber sobre Skillara AI, nuestro CV y cómo funciona la plataforma.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
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

          <div className="mt-10 glass-card rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                <Lock size={18} style={{ color: "var(--accent-1)" }} />
              </div>
              <div>
                <p className="font-bold text-sm">¿Tenés otra pregunta?</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Escribinos a skillara.ai@gmail.com</p>
              </div>
            </div>
            <button onClick={() => navigate("/about#contacto")} className="btn-primary flex items-center gap-2 text-sm">
              <FileText size={14} /> Contactar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}