import { useState } from "react";

interface Props {
  onEdit: (prompt: string) => void;
  loading: boolean;
  disabled: boolean;
}

export default function PromptBar({ onEdit, loading, disabled }: Props) {
  const [prompt, setPrompt] = useState("");

  function handleSend() {
    if (!prompt.trim()) return;
    onEdit(prompt);
    setPrompt("");
  }

  return (
    <div className="flex gap-2 mt-4">
      <input
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder='Ej: "Cambia los colores a verde oscuro" o "Usa tipografía más moderna"'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled || loading}
      />
      <button
        onClick={handleSend}
        disabled={disabled || loading || !prompt.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
      >
        {loading ? "Editando..." : "Editar"}
      </button>
    </div>
  );
}