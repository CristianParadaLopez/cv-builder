import { CheckCircle2, Sparkles } from "lucide-react";
import type { Template, CVStyle } from "../pages/types/cv.types";

const templates: Template[] = [
  {
    id: "moderno",
    name: "Moderno",
    description: "Diseño limpio con acentos visuales modernos.",
    colors: ["#2563EB", "#1E293B", "#F8FAFC"],
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "clasico",
    name: "Clásico",
    description: "Elegancia profesional y estructura tradicional.",
    colors: ["#1E293B", "#475569", "#F1F5F9"],
    gradient: "from-slate-700 to-slate-500",
  },
  {
    id: "minimalista",
    name: "Minimalista",
    description: "Simple, limpio y enfocado en contenido.",
    colors: ["#111827", "#6B7280", "#FFFFFF"],
    gradient: "from-gray-800 to-gray-600",
  },
  {
    id: "creativo",
    name: "Creativo",
    description: "Visual llamativo y moderno con personalidad.",
    colors: ["#7C3AED", "#EC4899", "#FFF7ED"],
    gradient: "from-purple-600 to-pink-500",
  },
];

interface Props {
  selected: CVStyle;
  onSelect: (style: CVStyle) => void;
}

export default function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold mb-4"
          style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <Sparkles size={12} style={{ color: "var(--accent-2)" }} />
          Plantillas inteligentes
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2">Elegí tu estilo visual</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Seleccioná el diseño que mejor represente tu perfil profesional.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {templates.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300"
              style={{
                border: active ? "2px solid var(--accent-1)" : "1px solid var(--border)",
                background: active ? "var(--bg-card2)" : "var(--bg-card)",
                transform: active ? "scale(1.01)" : "scale(1)",
                boxShadow: active ? "0 0 0 4px rgba(59,130,246,0.12)" : "none",
              }}>

              {/* Preview Strip */}
              <div className={`h-28 bg-gradient-to-r ${t.gradient} relative overflow-hidden`}>
                {/* Fake CV mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 bg-white rounded-xl p-3 shadow-xl">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-1.5 bg-gray-800 rounded w-20 mb-1" />
                        <div className="h-1 bg-gray-300 rounded w-14" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1 bg-gray-200 rounded w-full" />
                      <div className="h-1 bg-gray-200 rounded w-5/6" />
                      <div className="h-1 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>

                {active && (
                  <div className="absolute top-3 right-3">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
                      <CheckCircle2 size={16} className="text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <div className="flex gap-2">
                    {t.colors.map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-full shadow-sm border"
                        style={{ backgroundColor: color, borderColor: "var(--border)" }} />
                    ))}
                  </div>
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
