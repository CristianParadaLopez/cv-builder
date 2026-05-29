// src/components/ChainedSelect.tsx
// Campo dependiente (chained select) para profesiones, cargos e instituciones
// UX Pattern: Progressive disclosure with search and autocomplete

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, Check, Building2, Briefcase, GraduationCap } from "lucide-react";
import { CATEGORIAS_PROFESIONALES, getCargosByCategoria } from "../../data/profesiones.ts";
import { INSTITUCIONES_SV, getInstitucionesByTipo } from "../../data/instituciones-sv.ts";

interface ChainedSelectProps {
  type: "profession" | "institution";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export default function ChainedSelect({ 
  type, 
  value, 
  onChange, 
  placeholder = "Seleccionar...",
  label,
  disabled = false 
}: ChainedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus en input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const clearSelection = () => {
    onChange("");
    setSearchTerm("");
    setSelectedCategory(null);
  };

  // Render para profesiones
  if (type === "profession") {
    const filteredCategories = CATEGORIAS_PROFESIONALES.filter(cat => 
      cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.cargos.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const cargosFiltrados = selectedCategory 
      ? getCargosByCategoria(selectedCategory).filter(c => 
          c.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

    return (
      <div ref={containerRef} className="relative">
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            {label}
          </label>
        )}

        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
          style={{
            background: "var(--bg-card2)",
            border: "1px solid var(--border)",
            color: value ? "var(--text)" : "var(--text-muted)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <div className="flex items-center gap-2">
            <Briefcase size={16} style={{ color: "var(--text-muted)" }} />
            <span className="text-sm">{value || placeholder}</span>
          </div>
          <div className="flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <X size={12} />
              </button>
            )}
            <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {/* Search */}
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                  style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  placeholder="Buscar profesión o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-h-72 overflow-y-auto">
              {!selectedCategory ? (
                // Mostrar categorías
                <div className="p-2">
                  <p className="text-xs font-semibold px-2 py-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Categorías
                  </p>
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition hover:bg-gray-100"
                    >
                      <span className="text-lg">{cat.icono}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{cat.nombre}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat.cargos.length} cargos</p>
                      </div>
                      <ChevronDown size={14} className="-rotate-90" style={{ color: "var(--text-muted)" }} />
                    </button>
                  ))}
                </div>
              ) : (
                // Mostrar cargos de categoría seleccionada
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 mb-1 transition hover:opacity-70"
                    style={{ color: "var(--accent-1)" }}
                  >
                    <ChevronDown size={12} className="rotate-90" />
                    Volver a categorías
                  </button>
                  <p className="text-xs font-semibold px-2 py-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {CATEGORIAS_PROFESIONALES.find(c => c.id === selectedCategory)?.nombre}
                  </p>
                  {cargosFiltrados.map((cargo) => (
                    <button
                      key={cargo}
                      type="button"
                      onClick={() => handleSelect(cargo)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition hover:bg-gray-100"
                    >
                      <Check size={14} className={value === cargo ? "opacity-100" : "opacity-0"} style={{ color: "var(--accent-1)" }} />
                      <span className="text-sm">{cargo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render para instituciones
  if (type === "institution") {
    const tipos = [
      { id: "universidad", label: "Universidades", icon: <GraduationCap size={14} /> },
      { id: "instituto_especializado", label: "Institutos Especializados", icon: <Building2 size={14} /> },
      { id: "instituto_tecnologico", label: "Institutos Tecnológicos", icon: <Building2 size={14} /> },
      { id: "escuela", label: "Escuelas", icon: <Building2 size={14} /> },
    ];

    const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

    const institucionesFiltradas = selectedTipo
      ? getInstitucionesByTipo(selectedTipo as any).filter(i =>
          i.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : INSTITUCIONES_SV.filter(i =>
          i.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
      <div ref={containerRef} className="relative">
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
            {label}
          </label>
        )}

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
          style={{
            background: "var(--bg-card2)",
            border: "1px solid var(--border)",
            color: value ? "var(--text)" : "var(--text-muted)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <div className="flex items-center gap-2">
            <Building2 size={16} style={{ color: "var(--text-muted)" }} />
            <span className="text-sm">{value || placeholder}</span>
          </div>
          <div className="flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <X size={12} />
              </button>
            )}
            <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
          </div>
        </button>

        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                  style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  placeholder="Buscar institución..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtros por tipo */}
            <div className="flex gap-1 p-2 border-b" style={{ borderColor: "var(--border)" }}>
              <button
                type="button"
                onClick={() => setSelectedTipo(null)}
                className={`text-xs px-2.5 py-1 rounded-full transition ${!selectedTipo ? "font-semibold" : ""}`}
                style={{
                  background: !selectedTipo ? "var(--accent-1)" : "var(--bg-card2)",
                  color: !selectedTipo ? "white" : "var(--text-muted)",
                }}
              >
                Todas
              </button>
              {tipos.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setSelectedTipo(tipo.id)}
                  className={`text-xs px-2.5 py-1 rounded-full transition flex items-center gap-1 ${selectedTipo === tipo.id ? "font-semibold" : ""}`}
                  style={{
                    background: selectedTipo === tipo.id ? "var(--accent-1)" : "var(--bg-card2)",
                    color: selectedTipo === tipo.id ? "white" : "var(--text-muted)",
                  }}
                >
                  {tipo.icon}
                  {tipo.label}
                </button>
              ))}
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {institucionesFiltradas.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelect(inst.nombre)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition hover:bg-gray-100"
                >
                  <Check size={14} className={value === inst.nombre ? "opacity-100" : "opacity-0"} style={{ color: "var(--accent-1)" }} />
                  <div className="flex-1">
                    <p className="text-sm">{inst.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        {inst.tipo.replace("_", " ")}
                      </span>
                      {inst.acreditada && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Acreditada
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}