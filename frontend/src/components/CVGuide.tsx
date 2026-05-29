// src/components/CVGuide.tsx
// Sistema de Información y Educación al Usuario - Paso 1
// UX/UI Design: Card-based, interactive, progressive disclosure

import { useState } from "react";
import {
  BookOpen, Target, FileText, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronDown, ChevronUp, ExternalLink,
  Monitor, Smartphone, Mail, MessageCircle, Building2,
  User, Briefcase, GraduationCap, Award, Globe,
  Search, Filter, Layout, Palette, Eye, Shield,
  Lightbulb, ArrowRight, X, HelpCircle, Sparkles,
  TrendingUp, Clock, Zap, Star, Lock, Unlock
} from "lucide-react";

interface Props {
  onStartBuilder: () => void;
  onSkip: () => void;
}

// ─── DATA: Guías de plataformas de empleo ──────────────────────────────────

interface PlatformGuide {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: "job_board" | "social" | "direct";
  region: string;
  cvRecommendation: "ats" | "designed" | "both";
  cvRecommendationWhy: string;
  tips: string[];
  photoAdvice: string;
  formatAdvice: string;
  url?: string;
}

const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    id: "computrabajo",
    name: "CompuTrabajo",
    icon: <Monitor size={20} />,
    type: "job_board",
    region: "Latinoamérica (El Salvador, Colombia, México, etc.)",
    cvRecommendation: "ats",
    cvRecommendationWhy: "CompuTrabajo usa filtros automáticos por palabras clave. Un CV con diseño visual puede no ser leído correctamente por el sistema.",
    tips: [
      "Usa palabras clave exactas del puesto al que aplicas",
      "No incluyas foto de perfil",
      "Formato: texto plano, 1-2 columnas simples",
      "Evita tablas, gráficos o elementos visuales complejos",
      "Guarda tu CV en .DOCX para mejor compatibilidad",
      "Completa tu perfil al 100% en la plataforma",
    ],
    photoAdvice: "❌ No incluir foto. CompuTrabajo es un job board tradicional y las fotos pueden generar sesgo inconsciente.",
    formatAdvice: "ATS Optimizado: Fuente Arial/Calibri, sin colores de acento, estructura lineal.",
    url: "https://www.computrabajo.com.sv",
  },
  {
    id: "indeed",
    name: "Indeed",
    icon: <Search size={20} />,
    type: "job_board",
    region: "Global (fuerte en América)",
    cvRecommendation: "ats",
    cvRecommendationWhy: "Indeed escanea automáticamente tu CV con IA para hacer 'match' con las ofertas. El formato ATS maximiza tus coincidencias.",
    tips: [
      "Sube tu CV en formato .DOCX o .PDF con texto seleccionable",
      "Usa títulos de sección estándar: 'Experiencia', 'Educación', 'Habilidades'",
      "Incluye fechas en formato MM/AAAA",
      "No uses encabezados ni pies de página",
      "Activa las alertas de empleo para tu perfil",
      "Aplica dentro de las primeras 24-48 horas de publicada la oferta",
    ],
    photoAdvice: "❌ No recomendado. Indeed es un agregador de ofertas y prefiere contenido escaneable.",
    formatAdvice: "ATS Estándar: Estructura clara, bullet points con verbos de acción, sin diseño gráfico.",
    url: "https://sv.indeed.com",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Globe size={20} />,
    type: "social",
    region: "Global",
    cvRecommendation: "designed",
    cvRecommendationWhy: "LinkedIn es una red social profesional. Aquí el factor humano importa. Un CV con diseño visual y foto profesional aumenta la confianza y las interacciones.",
    tips: [
      "Tu foto de LinkedIn debe ser profesional: fondo neutro, ropa formal, sonrisa natural",
      "El CV que compartas por mensaje puede ser diseñado (PDF visual)",
      "Personaliza cada mensaje de conexión",
      "Usa el 'Open to Work' badge estratégicamente",
      "Publica contenido relacionado con tu industria",
      "Pide recomendaciones a ex-jefes o colegas",
    ],
    photoAdvice: "✅ Sí, foto profesional obligatoria. Es una red social, la gente conecta con personas.",
    formatAdvice: "Diseñado Moderno: Puede incluir colores de marca personal, sidebar con foto, elementos visuales.",
    url: "https://www.linkedin.com",
  },
  {
    id: "elempleo",
    name: "Elempleo / Tecoloco",
    icon: <Briefcase size={20} />,
    type: "job_board",
    region: "Centroamérica",
    cvRecommendation: "ats",
    cvRecommendationWhy: "Plataformas regionales con ATS propio. Priorizan la información estructurada sobre el diseño.",
    tips: [
      "Completa el perfil con toda tu información",
      "Usa el mismo email que tu CV",
      "Activa notificaciones de ofertas relevantes",
      "Mantén tu CV actualizado mensualmente",
      "Usa títulos de trabajo estándar en tu industria",
    ],
    photoAdvice: "❌ Opcional, pero no recomendado para aplicaciones masivas.",
    formatAdvice: "ATS Simple: Una columna, fuente legible, sin elementos decorativos.",
  },
  {
    id: "correo",
    name: "Correo Directo / Email",
    icon: <Mail size={20} />,
    type: "direct",
    region: "Cualquiera",
    cvRecommendation: "designed",
    cvRecommendationWhy: "Cuando envías directamente a un reclutador o gerente, tu CV es visto por un humano. El diseño visual crea una primera impresión memorable y demuestra profesionalismo.",
    tips: [
      "Asunto del email: 'Aplicación: [Cargo] - [Tu Nombre]'",
      "Mensaje corto y profesional (máx 3 párrafos)",
      "Adjunta el CV en PDF (no .docx para evitar que se deforme)",
      "Incluye tu LinkedIn en la firma del email",
      "Envía entre martes y jueves, 9am-11am",
      "Haz follow-up después de 1 semana si no hay respuesta",
    ],
    photoAdvice: "✅ Recomendado si es un cargo de atención al público, ventas o creativo. Para técnico, opcional.",
    formatAdvice: "Diseñado Profesional: Elige el estilo según la empresa (corporativo = clásico, startup = moderno/creativo).",
  },
  {
    id: "whatsapp",
    name: "WhatsApp / Mensaje Directo",
    icon: <MessageCircle size={20} />,
    type: "direct",
    region: "Latinoamérica (muy común)",
    cvRecommendation: "designed",
    cvRecommendationWhy: "En Latinoamérica, muchas empresas pequeñas y medianas usan WhatsApp para reclutar. Un CV visual de 1 página en PDF se ve perfecto en móvil.",
    tips: [
      "Mantén el CV en 1 página máximo para móvil",
      "Usa letra grande (mín 11pt) para que se lea bien en pantalla pequeña",
      "Mensaje inicial: corto, cordial, con el cargo al que aplicas",
      "No envíes el CV sin contexto: presentate primero",
      "Horario ideal: 9am-12pm o 2pm-5pm",
      "Si no responden en 3 días, un follow-up corto está bien",
    ],
    photoAdvice: "✅ Sí, pero pequeña y profesional. En WhatsApp la confianza visual es clave.",
    formatAdvice: "Diseñado Compacto: 1 página, fuente grande, colores que contrasten bien en pantalla móvil.",
  },
  {
    id: "feria",
    name: "Feria de Empleo / Presencial",
    icon: <Building2 size={20} />,
    type: "direct",
    region: "Cualquiera",
    cvRecommendation: "designed",
    cvRecommendationWhy: "En una feria de empleo entregas tu CV físicamente. El papel de calidad con un diseño profesional hace que te recuerden entre cientos de candidatos.",
    tips: [
      "Imprime en papel blanco de 90-100gsm (no cartulina)",
      "Lleva varias copias (mínimo 10)",
      "Vístete según la industria: formal para corporativos, smart casual para startups",
      "Prepara un 'elevator pitch' de 30 segundos",
      "Pide tarjetas de contacto y envía follow-up en 24h",
      "Lleva una carpeta profesional para tus CVs",
    ],
    photoAdvice: "✅ Sí, foto profesional. En presencial el reclutador ya te ve, pero la foto en el CV refuerza la memoria.",
    formatAdvice: "Diseñado Impreso: Colores que se vean bien en papel, no muy oscuros que consuman mucha tinta.",
  },
  {
    id: "startup",
    name: "Startups / Tech Companies",
    icon: <Zap size={20} />,
    type: "direct",
    region: "Global",
    cvRecommendation: "both",
    cvRecommendationWhy: "Las startups tech valoran la creatividad pero también usan ATS. Envía un CV ATS para la aplicación online y uno diseñado para la entrevista presencial.",
    tips: [
      "Incluye links a GitHub, portfolio web o proyectos",
      "Menciona tecnologías específicas que usan",
      "Demuestra impacto con métricas: 'Aumenté X% en Y'",
      "Menciona experiencia en metodologías ágiles",
      "Un CV de 2 páginas está bien si es contenido relevante",
      "Incluye sección de proyectos personales",
    ],
    photoAdvice: "⚠️ Depende de la cultura. Investiga la empresa primero. En tech generalmente no es necesaria.",
    formatAdvice: "Diseñado Moderno o Minimalista: Limpio, con links clickeables, secciones bien definidas.",
  },
];

// ─── DATA: Preguntas frecuentes ────────────────────────────────────────────

interface FAQ {
  question: string;
  answer: string;
  category: "general" | "ats" | "diseno" | "plataformas" | "experiencia";
}

const FAQS: FAQ[] = [
  {
    question: "¿Qué es un ATS y por qué debería importarme?",
    answer: "ATS significa Applicant Tracking System (Sistema de Seguimiento de Candidatos). Es un software que usan el 90% de las empresas grandes para filtrar CVs automáticamente. El ATS escanea tu CV buscando palabras clave, estructura y formato. Si tu CV no es compatible con ATS, puede ser rechazado antes de que un humano lo vea — incluso si eres el candidato perfecto.",
    category: "ats",
  },
  {
    question: "¿Debo poner foto en mi CV?",
    answer: "Depende de dónde apliques. En plataformas como CompuTrabajo o Indeed: NO. En LinkedIn o envío directo por email/WhatsApp: SÍ, pero profesional. En Latinoamérica, muchas empresas esperan foto para cargos de atención al público. La regla: investiga la empresa y la plataforma antes de decidir.",
    category: "general",
  },
  {
    question: "¿Cuántas páginas debe tener mi CV?",
    answer: "Para la mayoría de roles: 1-2 páginas. Entry-level (primeros empleos): 1 página. Profesionales con 5+ años de experiencia: 2 páginas máximo. Solo académicos o investigadores pueden usar 3+. Si aplicas por ATS, manténlo en 1-2 páginas para que el sistema no se 'sature'.",
    category: "general",
  },
  {
    question: "No tengo experiencia laboral formal. ¿Qué pongo?",
    answer: "¡Tu experiencia informal VALE! Horas sociales, prácticas profesionales, proyectos universitarios, voluntariados, trabajos informales (ayudar en el negocio familiar), cursos con proyectos prácticos. Todo cuenta si lo describes profesionalmente. Usa verbos de acción y resultados: 'Coordiné', 'Implementé', 'Logré'.",
    category: "experiencia",
  },
  {
    question: "¿Qué formato de archivo es mejor: PDF o Word?",
    answer: "Para ATS: .DOCX es más seguro porque algunos ATS no pueden leer texto en PDFs con diseño complejo. Para envío directo a humanos: PDF siempre, porque mantiene el diseño intacto. Skillara genera ambos formatos por ti.",
    category: "general",
  },
  {
    question: "¿Qué son las palabras clave (keywords) y cómo las uso?",
    answer: "Las palabras clave son los términos específicos que el reclutador o el ATS busca. Están en la descripción del puesto. Por ejemplo, si la oferta dice 'Se requiere experiencia en React y Node.js', esas son tus keywords. Inclúyelas exactamente como aparecen en la oferta, en tu sección de habilidades y en la descripción de experiencia.",
    category: "ats",
  },
  {
    question: "¿Puedo usar el mismo CV para todas las aplicaciones?",
    answer: "NO. Cada CV debe adaptarse a cada puesto. Esto no significa rehacerlo todo, sino ajustar: el resumen profesional, las palabras clave, y destacar la experiencia más relevante. Con Skillara puedes generar múltiples versiones en minutos.",
    category: "general",
  },
  {
    question: "¿Qué es un CV ATS y cómo se ve?",
    answer: "Un CV ATS es un documento de texto plano, con una sola columna, fuentes estándar (Arial, Calibri, Times New Roman), sin tablas, sin gráficos, sin fotos, sin encabezados/pies de página. Se ve 'aburrido' pero es efectivo para pasar filtros automáticos. Skillara puede generar tu CV en modo ATS automáticamente.",
    category: "ats",
  },
  {
    question: "¿Las horas sociales cuentan como experiencia laboral?",
    answer: "¡Sí! Las horas sociales, prácticas profesionales y pasantías son experiencia válida. En tu CV, ponlas en una sección llamada 'Experiencia Profesional' o 'Experiencia y Prácticas'. Describe lo que hiciste con verbos de acción y resultados, igual que un trabajo formal. Ejemplo: 'Realicé 200 horas sociales en [Institución], coordinando actividades educativas para 50 niños, logrando un 30% de mejora en asistencia'.",
    category: "experiencia",
  },
  {
    question: "¿Qué plataformas de empleo existen en El Salvador?",
    answer: "Las principales son: CompuTrabajo (el más grande), Indeed, LinkedIn, Elempleo/Tecoloco, y grupos de Facebook/WhatsApp para empleos locales. También existen ferias de empleo presenciales organizadas por el MINED y universidades. No te quedes solo con una plataforma: usa 3-4 simultáneamente.",
    category: "plataformas",
  },
];

// ─── DATA: Tips de seguridad ───────────────────────────────────────────────

const SECURITY_TIPS = [
  {
    icon: <Lock size={18} />,
    title: "No compartas tu DUI o pasaporte",
    desc: "Ninguna plataforma de empleo legítima te pedirá tu DUI en la primera aplicación. Solo comparte documentos de identidad en entrevistas presenciales verificadas.",
  },
  {
    icon: <Shield size={18} />,
    title: "Verifica que la oferta sea real",
    desc: "Busca la empresa en Google, revisa su sitio web oficial, y busca reseñas en Glassdoor. Si te piden dinero para 'procesar tu aplicación', es estafa.",
  },
  {
    icon: <Eye size={18} />,
    title: "Cuida tu información personal",
    desc: "En tu CV público (para plataformas), no incluyas: DUI, dirección exacta, número de cuenta bancaria, o fotos personales no profesionales.",
  },
  {
    icon: <AlertTriangle size={18} />,
    title: "Desconfía de ofertas 'demasiado buenas'",
    desc: "Salarios exagerados para roles entry-level, trabajo remoto internacional sin entrevista, o promesas de pago inmediato son señales de alerta.",
  },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function CVGuide({ onStartBuilder, onSkip }: Props) {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const quizQuestions = [
    {
      question: "¿Vas a aplicar a un puesto a través de CompuTrabajo?",
      options: [
        { value: "ats", label: "Sí, usaré un CV ATS (texto plano, sin foto)", correct: true },
        { value: "designed", label: "No, usaré uno con diseño visual y foto", correct: false },
      ],
      explanation: "CompuTrabajo usa filtros automáticos. Un CV ATS tiene más chances de pasar el filtro inicial.",
    },
    {
      question: "¿Tienes experiencia laboral formal?",
      options: [
        { value: "yes", label: "Sí, tengo 2+ años de experiencia", correct: true },
        { value: "no", label: "No, solo horas sociales y proyectos", correct: true },
        { value: "mixed", label: "Tengo experiencia informal/mixta", correct: true },
      ],
      explanation: "¡Toda experiencia cuenta! Horas sociales, prácticas, proyectos universitarios y trabajo informal son válidos si los describes profesionalmente.",
    },
    {
      question: "¿Cuál es el formato de archivo más seguro para ATS?",
      options: [
        { value: "docx", label: ".DOCX (Microsoft Word)", correct: true },
        { value: "pdf", label: ".PDF con diseño complejo", correct: false },
        { value: "image", label: "Imagen JPG del CV", correct: false },
      ],
      explanation: ".DOCX es más compatible con la mayoría de ATS. Skillara genera ambos formatos para ti.",
    },
  ];

  const handleQuizAnswer = (questionIndex: number, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: value }));
    if (questionIndex < quizQuestions.length - 1) {
      setTimeout(() => setQuizStep(questionIndex + 1), 500);
    }
  };

  const getQuizResult = () => {
    const correct = Object.entries(quizAnswers).filter(([idx, val]) => {
      const q = quizQuestions[parseInt(idx)];
      const opt = q.options.find(o => o.value === val);
      return opt?.correct;
    }).length;
    return { correct, total: quizQuestions.length };
  };

  const sections = [
    { id: "intro", label: "Introducción", icon: <BookOpen size={16} /> },
    { id: "platforms", label: "Plataformas de Empleo", icon: <Globe size={16} /> },
    { id: "ats-vs-designed", label: "ATS vs Diseñado", icon: <Layout size={16} /> },
    { id: "faq", label: "Preguntas Frecuentes", icon: <HelpCircle size={16} /> },
    { id: "security", label: "Seguridad", icon: <Shield size={16} /> },
    { id: "quiz", label: "Mini Test", icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b px-6 py-4" style={{ 
        borderColor: "var(--border)", 
        background: "var(--bg-card)", 
        backdropFilter: "blur(20px)" 
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs"
              style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
              S
            </div>
            <div>
              <p className="text-sm font-bold">Skillara AI</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Guía Profesional de CVs</p>
            </div>
          </div>
          <button onClick={onSkip} className="text-sm font-medium transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}>
            Saltar guía →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 px-3" style={{ color: "var(--text-muted)" }}>
            Contenido
          </p>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setShowQuiz(s.id === "quiz"); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeSection === s.id ? "var(--bg-card2)" : "transparent",
                border: activeSection === s.id ? "1px solid var(--accent-1)" : "1px solid transparent",
                color: activeSection === s.id ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {s.icon}
              {s.label}
              {activeSection === s.id && <ChevronRight size={14} className="ml-auto" style={{ color: "var(--accent-1)" }} />}
            </button>
          ))}

          <div className="mt-8 p-4 rounded-2xl" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} style={{ color: "var(--accent-1)" }} />
              <p className="text-sm font-semibold">¿Listo para empezar?</p>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Toda esta información estará disponible durante todo el proceso de creación de tu CV.
            </p>
            <button onClick={onStartBuilder} className="btn-primary w-full text-sm py-2.5">
              Crear mi CV ahora
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* ─── INTRO ───────────────────────────────────────────────────── */}
          {activeSection === "intro" && (
            <div className="animate-slide-up space-y-8">
              <div className="glass-card rounded-3xl p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold mb-6"
                  style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  <GraduationCap size={12} style={{ color: "var(--accent-1)" }} />
                  Guía interactiva · 5 minutos de lectura
                </div>

                <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">
                  Tu CV es tu primera impresión profesional
                </h1>
                <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                  El <strong>98% de los candidatos</strong> no saben que existen diferentes tipos de CV para diferentes situaciones. 
                  Esta guía te enseñará todo lo que necesitás para destacar en el mercado laboral salvadoreño y latinoamericano.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: <FileText size={20} />, title: "2 tipos de CV", desc: "ATS para filtros automáticos y Diseñado para impresionar a humanos", color: "#2563EB" },
                    { icon: <Globe size={20} />, title: "8 plataformas", desc: "Desde CompuTrabajo hasta WhatsApp, cada una necesita un enfoque diferente", color: "#7C3AED" },
                    { icon: <Lightbulb size={20} />, title: "Experiencia = Todo", desc: "Horas sociales, prácticas y proyectos cuentan como experiencia válida", color: "#10B981" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                        style={{ background: item.color }}>
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">El problema real</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        El <strong>75% de los CVs son rechazados por ATS</strong> antes de que un humano los vea. 
                        No es porque no seas calificado — es porque tu CV no está optimizado para máquinas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">La solución</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Skillara te permite generar <strong>ambos tipos de CV</strong> desde los mismos datos. 
                        Aplicá con ATS a plataformas online y llevá el diseñado a entrevistas presenciales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Decision Tree */}
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Target size={20} style={{ color: "var(--accent-1)" }} />
                  ¿Qué CV necesitás? Decisiones rápidas
                </h2>
                <div className="space-y-4">
                  {[
                    { q: "¿Aplicás por CompuTrabajo, Indeed o Elempleo?", a: "→ CV ATS (sin foto, texto plano)", color: "#2563EB" },
                    { q: "¿Enviás por correo directo a un reclutador?", a: "→ CV Diseñado (con foto, colores profesionales)", color: "#7C3AED" },
                    { q: "¿Mandás por WhatsApp a una empresa local?", a: "→ CV Diseñado Compacto (1 página, legible en móvil)", color: "#EC4899" },
                    { q: "¿Vas a una feria de empleo presencial?", a: "→ CV Diseñado Impreso (papel de calidad, foto profesional)", color: "#10B981" },
                    { q: "¿Tu perfil es LinkedIn?", a: "→ CV Diseñado Moderno (foto obligatoria, links clickeables)", color: "#F59E0B" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.q}</p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: item.color }}>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── PLATFORMS ─────────────────────────────────────────────────── */}
          {activeSection === "platforms" && (
            <div className="animate-slide-up space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Globe size={20} style={{ color: "var(--accent-1)" }} />
                  Plataformas de Empleo en El Salvador
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Cada plataforma tiene reglas diferentes. Elegí la plataforma para ver recomendaciones específicas.
                </p>

                {/* Platform Selector */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  {PLATFORM_GUIDES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(selectedPlatform === p.id ? null : p.id)}
                      className="relative p-4 rounded-2xl text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: selectedPlatform === p.id ? "var(--bg-card2)" : "var(--bg-card)",
                        border: selectedPlatform === p.id ? "2px solid var(--accent-1)" : "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                          {p.icon}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{p.region}</span>
                      </div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.cvRecommendation === "ats" ? "bg-blue-100 text-blue-700" :
                          p.cvRecommendation === "designed" ? "bg-purple-100 text-purple-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {p.cvRecommendation === "ats" ? "CV ATS" : p.cvRecommendation === "designed" ? "CV Diseñado" : "Ambos"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Platform Detail */}
                {selectedPlatform && (() => {
                  const p = PLATFORM_GUIDES.find(g => g.id === selectedPlatform)!;
                  return (
                    <div className="rounded-2xl p-6 animate-slide-up" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                            style={{ background: "var(--accent-1)", color: "white" }}>
                            Visitar <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Target size={16} style={{ color: "var(--accent-1)" }} />
                            <p className="text-sm font-semibold">Recomendación de CV</p>
                          </div>
                          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{p.cvRecommendationWhy}</p>
                          <div className="p-3 rounded-xl mb-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Formato recomendado</p>
                            <p className="text-sm">{p.formatAdvice}</p>
                          </div>
                          <div className="p-3 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Foto de perfil</p>
                            <p className="text-sm">{p.photoAdvice}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb size={16} style={{ color: "var(--accent-2)" }} />
                            <p className="text-sm font-semibold">Tips específicos</p>
                          </div>
                          <ul className="space-y-2">
                            {p.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
                                <span style={{ color: "var(--text-muted)" }}>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ─── ATS vs DISEÑADO ───────────────────────────────────────────── */}
          {activeSection === "ats-vs-designed" && (
            <div className="animate-slide-up space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Layout size={20} style={{ color: "var(--accent-1)" }} />
                  ATS vs CV Diseñado: La comparación completa
                </h2>
                <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                  Entender la diferencia es clave. No es que uno sea mejor que el otro — cada uno tiene su momento.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-muted)" }}>Aspecto</th>
                        <th className="text-left py-3 px-4 font-semibold text-blue-600">CV ATS</th>
                        <th className="text-left py-3 px-4 font-semibold text-purple-600">CV Diseñado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { aspect: "Propósito", ats: "Pasar filtros automáticos de software", designed: "Impresionar a un reclutador humano" },
                        { aspect: "Layout", ats: "Una sola columna, lineal", designed: "Puede tener 2 columnas, sidebar" },
                        { aspect: "Columnas/Tablas", ats: "❌ Prohibido (el ATS no las lee)", designed: "✅ Permitido" },
                        { aspect: "Foto de perfil", ats: "❌ No recomendado", designed: "✅ Sí, profesional" },
                        { aspect: "Gráficos/Iconos", ats: "❌ No (el ATS no los entiende)", designed: "✅ Sí, para impacto visual" },
                        { aspect: "Fuente", ats: "Arial, Calibri, Times New Roman", designed: "Cualquiera legible" },
                        { aspect: "Formato archivo", ats: ".DOCX (más compatible)", designed: ".PDF (mantiene diseño)" },
                        { aspect: "Páginas", ats: "1-2 máximo", designed: "1-2 (puede extenderse si es relevante)" },
                        { aspect: "Headers/Footers", ats: "❌ Evitar (el ATS los ignora)", designed: "✅ Permitidos" },
                        { aspect: "Colores", ats: "Negro y gris únicamente", designed: "Colores de marca personal" },
                        { aspect: "Mejor para", ats: "CompuTrabajo, Indeed, aplicaciones masivas", designed: "Email directo, LinkedIn, ferias de empleo" },
                        { aspect: "Palabras clave", ats: "Críticas: deben coincidir exacto con la oferta", designed: "Importantes pero no críticas" },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="py-3 px-4 font-medium">{row.aspect}</td>
                          <td className="py-3 px-4" style={{ color: "var(--text-muted)" }}>{row.ats}</td>
                          <td className="py-3 px-4" style={{ color: "var(--text-muted)" }}>{row.designed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-6 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))", border: "1px solid var(--border)" }}>
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} style={{ color: "var(--accent-1)" }} />
                    <div>
                      <p className="font-semibold mb-1">💡 Consejo de Skillara</p>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        La estrategia ganadora es tener <strong>ambos CVs listos</strong>. Aplicá con el ATS a plataformas online 
                        y cuando te llamen para entrevista, llevá el diseñado impreso. Skillara genera ambos desde tus mismos datos 
                        en segundos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── FAQ ─────────────────────────────────────────────────────── */}
          {activeSection === "faq" && (
            <div className="animate-slide-up space-y-4">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <HelpCircle size={20} style={{ color: "var(--accent-1)" }} />
                  Preguntas Frecuentes
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Respuestas a las dudas más comunes sobre CVs, empleo y plataformas.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["general", "ats", "diseno", "plataformas", "experiencia"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setExpandedFAQ(null)}
                      className="text-xs px-3 py-1.5 rounded-full font-medium capitalize"
                      style={{ 
                        background: "var(--bg-card2)", 
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)" 
                      }}
                    >
                      {cat === "diseno" ? "diseño" : cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left transition-all"
                        style={{ background: expandedFAQ === i ? "var(--bg-card2)" : "var(--bg-card)" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
                            style={{ 
                              background: faq.category === "ats" ? "rgba(37,99,235,0.15)" :
                                faq.category === "experiencia" ? "rgba(16,185,129,0.15)" :
                                faq.category === "plataformas" ? "rgba(245,158,11,0.15)" :
                                "var(--bg-card2)",
                              color: faq.category === "ats" ? "#2563EB" :
                                faq.category === "experiencia" ? "#10B981" :
                                faq.category === "plataformas" ? "#F59E0B" :
                                "var(--text-muted)"
                            }}>
                            {faq.category === "diseno" ? "diseño" : faq.category}
                          </span>
                          <span className="text-sm font-medium">{faq.question}</span>
                        </div>
                        {expandedFAQ === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedFAQ === i && (
                        <div className="px-4 pb-4 pt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)", background: "var(--bg-card2)" }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── SECURITY ──────────────────────────────────────────────────── */}
          {activeSection === "security" && (
            <div className="animate-slide-up space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Shield size={20} style={{ color: "var(--accent-1)" }} />
                  Seguridad en tu Búsqueda de Empleo
                </h2>
                <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                  Protegé tu información personal y evitá estafas durante tu proceso de aplicación.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {SECURITY_TIPS.map((tip, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                          {tip.icon}
                        </div>
                        <h3 className="font-bold text-sm">{tip.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tip.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-5 rounded-2xl" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
                    <div>
                      <p className="font-semibold text-sm mb-1">🚩 Señales de alerta de estafas laborales</p>
                      <ul className="text-sm space-y-1" style={{ color: "var(--text-muted)" }}>
                        <li>• Te piden dinero para "procesar tu aplicación" o "capacitación"</li>
                        <li>• La oferta promete salarios exagerados para puestos entry-level</li>
                        <li>• No hay entrevista presencial ni video llamada</li>
                        <li>• El dominio del email no coincide con la empresa real</li>
                        <li>• Te piden información bancaria antes de contratarte</li>
                        <li>• La empresa no aparece en Google o tiene reseñas negativas recientes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── QUIZ ──────────────────────────────────────────────────────── */}
          {activeSection === "quiz" && (
            <div className="animate-slide-up space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Sparkles size={20} style={{ color: "var(--accent-1)" }} />
                  Mini Test: ¿Ya sabés lo suficiente?
                </h2>
                <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                  Respondé estas 3 preguntas para verificar que entendiste los conceptos clave.
                </p>

                {!showQuiz ? (
                  <button 
                    onClick={() => setShowQuiz(true)} 
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    <Zap size={16} />
                    Empezar el test
                  </button>
                ) : quizStep < quizQuestions.length ? (
                  <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                      {quizQuestions.map((_, i) => (
                        <div key={i} className="h-1.5 flex-1 rounded-full"
                          style={{ 
                            background: i <= quizStep ? "var(--accent-1)" : "var(--border)" 
                          }} 
                        />
                      ))}
                    </div>

                    <div className="mb-6">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block"
                        style={{ background: "var(--accent-1)", color: "white" }}>
                        Pregunta {quizStep + 1} de {quizQuestions.length}
                      </span>
                      <h3 className="text-lg font-bold">{quizQuestions[quizStep].question}</h3>
                    </div>

                    <div className="space-y-3">
                      {quizQuestions[quizStep].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleQuizAnswer(quizStep, opt.value)}
                          className="w-full text-left p-4 rounded-xl transition-all hover:scale-[1.01]"
                          style={{
                            background: quizAnswers[quizStep] === opt.value 
                              ? (opt.correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)")
                              : "var(--bg-card2)",
                            border: quizAnswers[quizStep] === opt.value
                              ? (opt.correct ? "1px solid #10b981" : "1px solid #ef4444")
                              : "1px solid var(--border)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              quizAnswers[quizStep] === opt.value
                                ? (opt.correct ? "border-emerald-500" : "border-red-500")
                                : "border-gray-300"
                            }`}>
                              {quizAnswers[quizStep] === opt.value && (
                                <div className={`w-2.5 h-2.5 rounded-full ${opt.correct ? "bg-emerald-500" : "bg-red-500"}`} />
                              )}
                            </div>
                            <span className="text-sm font-medium">{opt.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {quizAnswers[quizStep] !== undefined && (
                      <div className={`mt-4 p-4 rounded-xl text-sm ${
                        quizQuestions[quizStep].options.find(o => o.value === quizAnswers[quizStep])?.correct
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-red-50 text-red-800"
                      }`}>
                        <p className="font-semibold mb-1">
                          {quizQuestions[quizStep].options.find(o => o.value === quizAnswers[quizStep])?.correct
                            ? "✅ ¡Correcto!" : "❌ No es la mejor opción"}
                        </p>
                        <p>{quizQuestions[quizStep].explanation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black"
                      style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
                      {getQuizResult().correct}/{getQuizResult().total}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {getQuizResult().correct === getQuizResult().total 
                        ? "🎉 ¡Excelente! Ya estás listo" 
                        : getQuizResult().correct >= 2 
                          ? "👍 ¡Bien! Podés mejorar un poco más" 
                          : "📚 Recomendado: revisá la guía de nuevo"}
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                      {getQuizResult().correct === getQuizResult().total 
                        ? "Dominás los conceptos clave. Ya podés crear tu CV con confianza."
                        : "No te preocupes, la guía está disponible durante todo el proceso. Creá tu CV y consultala cuando necesites."}
                    </p>
                    <button onClick={onStartBuilder} className="btn-primary flex items-center gap-2 mx-auto">
                      Crear mi CV ahora
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}