// src/components/HelpTooltip.tsx
// Tooltip contextual de ayuda que aparece en cada campo del formulario
// UX Pattern: Progressive disclosure - info disponible bajo demanda

import { useState } from "react";
import { HelpCircle, X, Sparkles, Lightbulb, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  content: string;
  type?: "info" | "tip" | "warning" | "ai-suggest";
  children?: React.ReactNode;
}

export default function HelpTooltip({ title, content, type = "info", children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    info: { bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.2)", icon: "#2563EB", iconComponent: <HelpCircle size={14} /> },
    tip: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: "#F59E0B", iconComponent: <Lightbulb size={14} /> },
    warning: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: "#EF4444", iconComponent: <HelpCircle size={14} /> },
    "ai-suggest": { bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)", icon: "#7C3AED", iconComponent: <Sparkles size={14} /> },
  };

  const style = styles[type];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full ml-1.5 transition-all hover:scale-110"
        style={{ background: style.bg, color: style.icon }}
        title={title}
      >
        {style.iconComponent}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Tooltip */}
          <div 
            className="absolute z-50 w-80 p-4 rounded-xl shadow-2xl animate-slide-up"
            style={{ 
              background: "var(--bg-card)", 
              border: `1px solid ${style.border}`,
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ color: style.icon }}>{style.iconComponent}</span>
                <span className="text-xs font-semibold">{title}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 rounded-full flex items-center justify-center transition hover:bg-gray-100"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {content}
            </p>
            {children && (
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                {children}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}