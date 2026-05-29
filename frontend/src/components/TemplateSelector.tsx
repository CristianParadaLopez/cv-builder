// src/components/TemplateSelector.tsx
// Selector de plantillas tipo Canva con preview real y recomendaciones inteligentes
// UX Pattern: Visual gallery with progressive disclosure and smart recommendations

import { useState, useEffect } from "react";
import {
  CheckCircle2, Sparkles, Eye, Layout, FileText,
  Monitor, Mail, MessageCircle, Building2, Globe,
  ArrowRight, Star, Info, ChevronDown, ChevronUp,
  Shield, Palette, Type, Columns, Image as ImageIcon,
  Zap, TrendingUp, Award,
  Search,
  Briefcase
} from "lucide-react";
import type { CVStyle, CVMode, PlatformRecommendation } from "../pages/types/cv.types";

interface Props {
  selected: CVStyle;
  onSelect: (style: CVStyle) => void;
  selectedMode: CVMode;
  onSelectMode: (mode: CVMode) => void;
}

// ─── DATA: Templates con previews visuales completos ───────────────────────

interface TemplateData {
  id: CVStyle;
  name: string;
  tagline: string;
  description: string;
  colors: string[];
  gradient: string;
  icon: React.ReactNode;
  features: string[];
  bestFor: string[];
  atsCompatible: boolean;
  previewHTML: string; // HTML miniatura del CV
  stats: { label: string; value: string }[];
}

const TEMPLATES: TemplateData[] = [
  {
    id: "moderno",
    name: "Moderno",
    tagline: "Profesional y contemporáneo",
    description: "Diseño limpio con sidebar izquierdo y acentos de color azul. Ideal para roles corporativos, tecnología y negocios.",
    colors: ["#2563EB", "#1E293B", "#F8FAFC", "#64748B"],
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    icon: <Layout size={20} />,
    features: [
      "Sidebar izquierdo con datos de contacto",
      "Banda de color en encabezado",
      "Tipografía sans-serif moderna",
      "Secciones con líneas divisoras",
      "Bullets de color de acento",
    ],
    bestFor: ["Tecnología", "Negocios", "Marketing", "Consultoría", "Ventas"],
    atsCompatible: true,
    previewHTML: `
      <div style="width:100%;height:100%;background:#fff;font-family:Arial,sans-serif;display:flex;flex-direction:column;padding:8px;box-sizing:border-box;">
        <div style="background:linear-gradient(135deg,#2563EB,#06b6d4);height:28px;border-radius:4px 4px 0 0;display:flex;align-items:center;padding:0 8px;">
          <div style="width:16px;height:16px;background:rgba(255,255,255,0.3);border-radius:50%;margin-right:6px;"></div>
          <div style="width:40px;height:4px;background:rgba(255,255,255,0.5);border-radius:2px;"></div>
        </div>
        <div style="display:flex;flex:1;margin-top:4px;gap:4px;">
          <div style="width:35%;background:#f1f5f9;border-radius:4px;padding:6px;">
            <div style="width:20px;height:20px;background:#cbd5e1;border-radius:50%;margin-bottom:4px;"></div>
            <div style="width:100%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:3px;"></div>
            <div style="width:80%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:3px;"></div>
            <div style="width:90%;height:3px;background:#e2e8f0;border-radius:2px;"></div>
          </div>
          <div style="flex:1;padding:6px;">
            <div style="width:70%;height:6px;background:#1e293b;border-radius:3px;margin-bottom:4px;"></div>
            <div style="width:50%;height:4px;background:#64748b;border-radius:2px;margin-bottom:6px;"></div>
            <div style="width:100%;height:2px;background:#e2e8f0;margin-bottom:4px;"></div>
            <div style="width:90%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
            <div style="width:80%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
            <div style="width:85%;height:3px;background:#e2e8f0;border-radius:2px;"></div>
          </div>
        </div>
      </div>
    `,
    stats: [
      { label: "Popularidad", value: "92%" },
      { label: "ATS Score", value: "95/100" },
      { label: "Usuarios", value: "2.4k" },
    ],
  },
  {
    id: "clasico",
    name: "Clásico",
    tagline: "Elegancia ejecutiva",
    description: "Formato tradicional de una columna con tipografía serif. Perfecto para roles formales, gobierno, derecho y finanzas.",
    colors: ["#1E293B", "#475569", "#F1F5F9", "#94A3B8"],
    gradient: "from-slate-800 via-slate-700 to-slate-500",
    icon: <Type size={20} />,
    features: [
      "Una sola columna centrada",
      "Tipografía serif (Georgia/Times)",
      "Líneas horizontales elegantes",
      "Títulos en versalitas",
      "Aspecto formal ejecutivo",
    ],
    bestFor: ["Derecho", "Finanzas", "Gobierno", "Contabilidad", "Recursos Humanos"],
    atsCompatible: true,
    previewHTML: `
      <div style="width:100%;height:100%;background:#fff;font-family:Georgia,serif;display:flex;flex-direction:column;padding:8px;box-sizing:border-box;align-items:center;">
        <div style="text-align:center;margin-bottom:6px;">
          <div style="width:60%;height:8px;background:#1e293b;border-radius:4px;margin:0 auto 3px;"></div>
          <div style="width:40%;height:4px;background:#64748b;border-radius:2px;margin:0 auto;"></div>
        </div>
        <div style="width:80%;height:1px;background:#cbd5e1;margin-bottom:6px;"></div>
        <div style="width:100%;padding:0 12px;">
          <div style="width:30%;height:5px;background:#1e293b;border-radius:3px;margin-bottom:4px;"></div>
          <div style="width:100%;height:2px;background:#e2e8f0;margin-bottom:4px;"></div>
          <div style="width:90%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:85%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:80%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:6px;"></div>
          <div style="width:30%;height:5px;background:#1e293b;border-radius:3px;margin-bottom:4px;"></div>
          <div style="width:100%;height:2px;background:#e2e8f0;margin-bottom:4px;"></div>
          <div style="width:88%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:82%;height:3px;background:#e2e8f0;border-radius:2px;"></div>
        </div>
      </div>
    `,
    stats: [
      { label: "Popularidad", value: "78%" },
      { label: "ATS Score", value: "98/100" },
      { label: "Usuarios", value: "1.8k" },
    ],
  },
  {
    id: "minimalista",
    name: "Minimalista",
    tagline: "Menos es más",
    description: "Diseño ultra limpio con mucho espacio en blanco. Enfocado en el contenido sin distracciones. Ideal para diseñadores, startups y creativos.",
    colors: ["#111827", "#6B7280", "#FFFFFF", "#E5E7EB"],
    gradient: "from-gray-900 via-gray-700 to-gray-500",
    icon: <Columns size={20} />,
    features: [
      "Mucho espacio en blanco",
      "Sin colores de acento",
      "Tipografía sans-serif ligera",
      "Sin bordes ni líneas",
      "Estilo nórdico limpio",
    ],
    bestFor: ["Diseño", "Startups", "Arte", "Fotografía", "UX/UI"],
    atsCompatible: true,
    previewHTML: `
      <div style="width:100%;height:100%;background:#fff;font-family:Helvetica,Arial,sans-serif;display:flex;flex-direction:column;padding:12px;box-sizing:border-box;">
        <div style="margin-bottom:8px;">
          <div style="width:50%;height:10px;background:#111827;border-radius:2px;margin-bottom:4px;"></div>
          <div style="width:35%;height:4px;background:#6b7280;border-radius:2px;"></div>
        </div>
        <div style="margin-bottom:8px;">
          <div style="width:25%;height:4px;background:#d1d5db;border-radius:2px;margin-bottom:6px;"></div>
          <div style="width:100%;height:3px;background:#f3f4f6;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:90%;height:3px;background:#f3f4f6;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:85%;height:3px;background:#f3f4f6;border-radius:2px;"></div>
        </div>
        <div style="margin-bottom:8px;">
          <div style="width:25%;height:4px;background:#d1d5db;border-radius:2px;margin-bottom:6px;"></div>
          <div style="width:100%;height:3px;background:#f3f4f6;border-radius:2px;margin-bottom:2px;"></div>
          <div style="width:88%;height:3px;background:#f3f4f6;border-radius:2px;"></div>
        </div>
      </div>
    `,
    stats: [
      { label: "Popularidad", value: "85%" },
      { label: "ATS Score", value: "92/100" },
      { label: "Usuarios", value: "1.5k" },
    ],
  },
  {
    id: "creativo",
    name: "Creativo",
    tagline: "Destaca con personalidad",
    description: "Colores vibrantes con degradado púrpura-rosa y sidebar colorido. Para roles creativos, marketing digital, diseño gráfico y startups innovadoras.",
    colors: ["#7C3AED", "#EC4899", "#FFF7ED", "#FCD34D"],
    gradient: "from-purple-600 via-fuchsia-500 to-pink-500",
    icon: <Palette size={20} />,
    features: [
      "Sidebar con degradado vibrante",
      "Colores púrpura y rosa",
      "Badges de color para skills",
      "Encabezado llamativo",
      "Fondo cálido",
    ],
    bestFor: ["Marketing", "Diseño Gráfico", "Publicidad", "Startups", "Social Media"],
    atsCompatible: false,
    previewHTML: `
      <div style="width:100%;height:100%;background:#fff7ed;font-family:Arial,sans-serif;display:flex;flex-direction:column;padding:8px;box-sizing:border-box;">
        <div style="display:flex;flex:1;gap:4px;">
          <div style="width:35%;background:linear-gradient(180deg,#7c3aed,#ec4899);border-radius:4px;padding:6px;">
            <div style="width:20px;height:20px;background:rgba(255,255,255,0.3);border-radius:50%;margin-bottom:4px;"></div>
            <div style="width:100%;height:3px;background:rgba(255,255,255,0.4);border-radius:2px;margin-bottom:3px;"></div>
            <div style="width:80%;height:3px;background:rgba(255,255,255,0.4);border-radius:2px;margin-bottom:3px;"></div>
            <div style="display:flex;gap:2px;margin-top:4px;">
              <div style="width:20px;height:8px;background:rgba(255,255,255,0.3);border-radius:4px;"></div>
              <div style="width:20px;height:8px;background:rgba(255,255,255,0.3);border-radius:4px;"></div>
            </div>
          </div>
          <div style="flex:1;padding:6px;">
            <div style="width:70%;height:6px;background:#7c3aed;border-radius:3px;margin-bottom:4px;"></div>
            <div style="width:50%;height:4px;background:#ec4899;border-radius:2px;margin-bottom:6px;"></div>
            <div style="width:100%;height:2px;background:#fed7aa;margin-bottom:4px;"></div>
            <div style="width:90%;height:3px;background:#ffedd5;border-radius:2px;margin-bottom:2px;"></div>
            <div style="width:85%;height:3px;background:#ffedd5;border-radius:2px;"></div>
          </div>
        </div>
      </div>
    `,
    stats: [
      { label: "Popularidad", value: "88%" },
      { label: "ATS Score", value: "45/100" },
      { label: "Usuarios", value: "1.2k" },
    ],
  },
];

// ─── DATA: Recomendaciones por plataforma ──────────────────────────────────

const PLATFORM_RECOMMENDATIONS: PlatformRecommendation[] = [
  { platform: "CompuTrabajo", mode: "ats", reason: "Usa filtros automáticos. CV ATS maximiza tus chances." },
  { platform: "Indeed", mode: "ats", reason: "El sistema escanea automáticamente con IA." },
  { platform: "LinkedIn", mode: "designed", reason: "Red social profesional. El diseño visual aumenta la confianza." },
  { platform: "Elempleo", mode: "ats", reason: "Plataforma regional con ATS propio." },
  { platform: "Correo directo", mode: "designed", reason: "Va directo a un humano. El diseño crea impacto." },
  { platform: "WhatsApp", mode: "designed", reason: "Empresas locales prefieren CV visual en móvil." },
  { platform: "Feria de empleo", mode: "designed", reason: "Entrega física. El papel de calidad con diseño te hace memorable." },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function TemplateSelector({ selected, onSelect, selectedMode, onSelectMode }: Props) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showPlatformGuide, setShowPlatformGuide] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  // Animación de selección
  const handleSelect = (id: CVStyle) => {
    setAnimatingCard(id);
    setTimeout(() => {
      onSelect(id);
      setAnimatingCard(null);
    }, 300);
  };

  const activeTemplate = TEMPLATES.find(t => t.id === selected);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
          style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <Palette size={14} style={{ color: "var(--accent-1)" }} />
          Paso 1 de 5 · Elegí tu estilo
        </div>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">
          Elegí tu diseño
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Cada estilo está optimizado para diferentes industrias y plataformas de empleo.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-1 flex gap-1" style={{ background: "var(--bg-card2)" }}>
          <button
            onClick={() => onSelectMode("ats")}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: selectedMode === "ats" ? "var(--bg-card)" : "transparent",
              border: selectedMode === "ats" ? "1px solid var(--accent-1)" : "1px solid transparent",
              color: selectedMode === "ats" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            <FileText size={16} style={{ color: selectedMode === "ats" ? "var(--accent-1)" : "var(--text-muted)" }} />
            <span>Modo ATS</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
              Para filtros automáticos
            </span>
          </button>
          <button
            onClick={() => onSelectMode("designed")}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: selectedMode === "designed" ? "var(--bg-card)" : "transparent",
              border: selectedMode === "designed" ? "1px solid var(--accent-1)" : "1px solid transparent",
              color: selectedMode === "designed" ? "var(--text)" : "var(--text-muted)",
            }}
          >
            <Layout size={16} style={{ color: selectedMode === "designed" ? "var(--accent-1)" : "var(--text-muted)" }} />
            <span>Modo Diseñado</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background: "rgba(124,58,237,0.15)", color: "#7c3aed" }}>
              Para impresionar humanos
            </span>
          </button>
        </div>

        {/* Mode Info */}
        <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
          <div className="flex items-start gap-3">
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
            <p style={{ color: "var(--text-muted)" }}>
              {selectedMode === "ats" 
                ? "Modo ATS: Texto plano, una columna, sin fotos ni gráficos. Máxima compatibilidad con filtros automáticos de CompuTrabajo e Indeed."
                : "Modo Diseñado: Colores, fotos, sidebar, elementos visuales. Ideal para LinkedIn, correo directo, WhatsApp y entrevistas presenciales."}
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {TEMPLATES.map((template) => {
          const isSelected = selected === template.id;
          const isHovered = hoveredTemplate === template.id;
          const isAnimating = animatingCard === template.id;
          const isCompatible = selectedMode === "ats" ? template.atsCompatible : true;

          return (
            <div
              key={template.id}
              className="relative group"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <button
                onClick={() => isCompatible && handleSelect(template.id)}
                disabled={!isCompatible}
                className={`w-full text-left rounded-3xl overflow-hidden transition-all duration-300 ${
                  isAnimating ? "scale-95" : ""
                } ${!isCompatible ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl"}`}
                style={{
                  background: isSelected ? "var(--bg-card2)" : "var(--bg-card)",
                  border: isSelected 
                    ? "2px solid var(--accent-1)" 
                    : isHovered 
                      ? "2px solid var(--border)" 
                      : "1px solid var(--border)",
                  transform: isHovered && isCompatible ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isSelected 
                    ? "0 0 0 4px rgba(59,130,246,0.12), 0 20px 40px rgba(0,0,0,0.1)" 
                    : isHovered 
                      ? "0 20px 40px rgba(0,0,0,0.15)" 
                      : "none",
                }}
              >
                {/* Preview Area */}
                <div className={`h-48 bg-gradient-to-r ${template.gradient} relative overflow-hidden p-4`}>
                  {/* Mini CV Preview */}
                  <div className="absolute inset-4 rounded-xl overflow-hidden shadow-2xl"
                    style={{ 
                      transform: isHovered ? "scale(1.02) rotate(-1deg)" : "scale(1) rotate(0deg)",
                      transition: "transform 0.4s ease",
                    }}>
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;}</style></head><body>${template.previewHTML}</body></html>`}
                      className="w-full h-full"
                      style={{ border: "none" }}
                      title={`Preview ${template.name}`}
                    />
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 size={18} className="text-blue-500" />
                      </div>
                    </div>
                  )}

                  {/* ATS Warning */}
                  {!isCompatible && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <div className="text-center text-white">
                        <Shield size={24} className="mx-auto mb-2" />
                        <p className="text-sm font-semibold">No compatible con ATS</p>
                        <p className="text-xs opacity-80">Cambiar a modo Diseñado</p>
                      </div>
                    </div>
                  )}

                  {/* Stats overlay on hover */}
                  {isHovered && isCompatible && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                      {template.stats.map((stat, i) => (
                        <div key={i} className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                          <p className="text-xs font-bold" style={{ color: template.colors[0] }}>{stat.value}</p>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ background: template.colors[0] }}>
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{template.tagline}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {template.colors.map((color, i) => (
                        <div key={i} className="w-5 h-5 rounded-full shadow-sm border"
                          style={{ backgroundColor: color, borderColor: "var(--border)" }} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                    {template.description}
                  </p>

                  {/* Best for tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {template.bestFor.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Features toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(showDetails === template.id ? null : template.id);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold transition hover:opacity-70"
                    style={{ color: "var(--accent-1)" }}
                  >
                    {showDetails === template.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showDetails === template.id ? "Ocultar detalles" : "Ver características"}
                  </button>

                  {showDetails === template.id && (
                    <ul className="mt-3 space-y-1.5 animate-slide-up">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                          <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: "var(--accent-1)" }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Platform Recommendation Guide */}
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setShowPlatformGuide(!showPlatformGuide)}
          className="w-full glass-card rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-lg"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }}>
              <Zap size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">¿No sabés qué modo elegir?</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Guía rápida según dónde vas a aplicar
              </p>
            </div>
          </div>
          {showPlatformGuide ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showPlatformGuide && (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-slide-up">
            {PLATFORM_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  {rec.platform === "CompuTrabajo" && <Monitor size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "Indeed" && <Search size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "LinkedIn" && <Globe size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "Elempleo" && <Briefcase size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "Correo directo" && <Mail size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "WhatsApp" && <MessageCircle size={14} style={{ color: "var(--accent-1)" }} />}
                  {rec.platform === "Feria de empleo" && <Building2 size={14} style={{ color: "var(--accent-1)" }} />}
                  <span className="text-sm font-semibold">{rec.platform}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-auto font-medium ${
                    rec.mode === "ats" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {rec.mode === "ats" ? "ATS" : "Diseñado"}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{rec.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {activeTemplate && (
        <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 animate-slide-up"
          style={{ border: "1px solid var(--accent-1)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: activeTemplate.colors[0] }}>
              {activeTemplate.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Seleccionado</p>
              <p className="text-lg font-bold">
                {activeTemplate.name} · {selectedMode === "ats" ? "Modo ATS" : "Modo Diseñado"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>ATS Score</p>
              <p className="text-xl font-black" style={{ color: activeTemplate.atsCompatible ? "#10b981" : "#ef4444" }}>
                {activeTemplate.stats[1].value}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}