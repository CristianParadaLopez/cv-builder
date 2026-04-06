import type { Template, CVStyle } from "../pages/types/cv.types";

const templates: Template[] = [
  {
    id: "moderno",
    name: "Moderno",
    description: "Diseño limpio con acentos de color",
    colors: ["#2563EB", "#1E293B", "#F8FAFC"],
    preview: "bg-blue-600",
  },
  {
    id: "clasico",
    name: "Clásico",
    description: "Elegante y tradicional",
    colors: ["#1E293B", "#475569", "#F1F5F9"],
    preview: "bg-slate-800",
  },
  {
    id: "minimalista",
    name: "Minimalista",
    description: "Simple, limpio y moderno",
    colors: ["#000000", "#6B7280", "#FFFFFF"],
    preview: "bg-gray-900",
  },
  {
    id: "creativo",
    name: "Creativo",
    description: "Llamativo y con personalidad",
    colors: ["#7C3AED", "#EC4899", "#FFF7ED"],
    preview: "bg-purple-600",
  },
];

interface Props {
  selected: CVStyle;
  onSelect: (style: CVStyle) => void;
}

export default function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
      <h2 className="text-lg font-bold text-blue-700 mb-4">Elegí tu estilo</h2>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`border-2 rounded-xl p-4 text-left transition ${
              selected === t.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${t.preview} flex items-center justify-center`}>
                <div className="w-6 h-0.5 bg-white mb-1 rounded" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                <div className="flex gap-1 mt-1">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}