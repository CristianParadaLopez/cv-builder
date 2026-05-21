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

export default function TemplateSelector({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb22,transparent_35%),radial-gradient(circle_at_bottom_left,#7c3aed22,transparent_35%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-4">
          ✨ Plantillas inteligentes
        </div>

        <h2 className="text-3xl font-black text-white mb-3">
          Elegí tu estilo visual
        </h2>

        <p className="text-gray-400 max-w-xl">
          Seleccioná el diseño que mejor represente tu perfil
          profesional.
        </p>
      </div>

      {/* Templates */}
      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        {templates.map((t) => {
          const active = selected === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`group relative overflow-hidden rounded-3xl border text-left transition-all duration-300
              ${
                active
                  ? "border-blue-500 bg-white/10 scale-[1.02] shadow-[0_0_40px_rgba(37,99,235,0.25)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {/* Top Preview */}
              <div
                className={`h-32 bg-gradient-to-r ${t.gradient} relative`}
              >
                {/* Fake CV */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 bg-white rounded-xl p-3 shadow-xl">

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300" />

                      <div className="flex-1">
                        <div className="h-2 bg-gray-800 rounded w-20 mb-1" />
                        <div className="h-1.5 bg-gray-300 rounded w-14" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-1.5 bg-gray-300 rounded w-full" />
                      <div className="h-1.5 bg-gray-300 rounded w-5/6" />
                      <div className="h-1.5 bg-gray-300 rounded w-2/3" />
                    </div>
                  </div>
                </div>

                {/* Selected Badge */}
                {active && (
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                    Seleccionado
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {t.name}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-3 mt-5">
                  {t.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border border-white/10 shadow-lg"
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>

                {/* Bottom Line */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-widest">
                    Diseño premium
                  </span>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600"
                        : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    →
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}