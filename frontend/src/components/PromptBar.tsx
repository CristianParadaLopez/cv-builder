import { useState } from "react";
import { Wand2, Loader2, Sparkles } from "lucide-react";

interface Props {
  onEdit: (prompt: string) => void;
  loading: boolean;
  disabled: boolean;
}

const suggestions = [
  "Haz los colores más vibrantes",
  "Usa una tipografía más moderna",
  "Haz el diseño más minimalista",
];

export default function PromptBar({ onEdit, loading, disabled }: Props) {
  const [prompt, setPrompt] = useState("");

  function handleSend() {
    if (!prompt.trim()) return;
    onEdit(prompt);
    setPrompt("");
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={16} style={{ color: "var(--accent-2)" }} />
        <span className="text-sm font-semibold">Editar con IA</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          Experimental
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            className="input-field pl-10"
            placeholder='Ej: "Cambia los colores a verde" o "Usa tipografía serif"'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={disabled || loading}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || loading || !prompt.trim()}
          className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
          {loading ? "Editando..." : "Aplicar"}
        </button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {suggestions.map((s) => (
          <button key={s} type="button"
            onClick={() => { setPrompt(s); }}
            className="text-xs px-3 py-1.5 rounded-full transition hover:opacity-80"
            style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            disabled={disabled || loading}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
