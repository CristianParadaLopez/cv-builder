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

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
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

        {/* Trigger - NO es button, es div con role="button" para evitar anidamiento */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            background: "var(--bg-card2)",
            border: "1px solid var(--border)",
            color: value ? "var(--text)" : "var(--text-muted)",
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Briefcase size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span className="text-sm truncate">{value || placeholder}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {value && (
              <button
                type="button"
                onClick={clearSelection}
                className="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-red-100 hover:text-red-500"
                style={{ color: "var(--text-muted)" }}
                aria-label="Limpiar selección"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown 
              size={16} 
              style={{ 
                color: "var(--text-muted)",
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-2 rounded-2xl shadow-2xl overflow-hidden"
            style={{ 
              background: "var(--bg-card)", 
              border: "1px solid var(--border)",
              maxHeight: '80vh'
            }}
          >
            {/* Search */}
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                  style={{ 
                    background: "var(--bg-card2)", 
                    border: "1px solid var(--border)", 
                    color: "var(--text)" 
                  }}
                  placeholder="Buscar profesión o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-h-64 sm:max-h-72 overflow-y-auto overscroll-contain">
              {!selectedCategory ? (
                // Mostrar categorías
                <div className="p-2">
                  <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Categorías
                  </p>
                  {filteredCategories.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                      No se encontraron resultados
                    </p>
                  ) : (
                    filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition hover:bg-gray-100 sm:hover:bg-opacity-50"
                        style={{ color: "var(--text)" }}
                      >
                        <span className="text-xl flex-shrink-0">{cat.icono}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{cat.nombre}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cat.cargos.length} cargos</p>
                        </div>
                        <ChevronDown size={14} className="-rotate-90 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                      </button>
                    ))
                  )}
                </div>
              ) : (
                // Mostrar cargos de categoría seleccionada
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 mb-1 transition hover:opacity-70"
                    style={{ color: "var(--accent-1)" }}
                  >
                    <ChevronDown size={12} className="rotate-90" />
                    Volver a categorías
                  </button>
                  <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {CATEGORIAS_PROFESIONALES.find(c => c.id === selectedCategory)?.nombre}
                  </p>
                  {cargosFiltrados.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                      No se encontraron cargos
                    </p>
                  ) : (
                    cargosFiltrados.map((cargo) => (
                      <button
                        key={cargo}
                        type="button"
                        onClick={() => handleSelect(cargo)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition hover:bg-gray-100"
                        style={{ color: "var(--text)" }}
                      >
                        <Check 
                          size={14} 
                          className="flex-shrink-0" 
                          style={{ 
                            color: "var(--accent-1)",
                            opacity: value === cargo ? 1 : 0
                          }} 
                        />
                        <span className="text-sm">{cargo}</span>
                      </button>
                    ))
                  )}
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
      { id: "instituto_especializado", label: "Inst. Especializados", icon: <Building2 size={14} /> },
      { id: "instituto_tecnologico", label: "Inst. Tecnológicos", icon: <Building2 size={14} /> },
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

        {/* Trigger - NO es button, es div con role="button" */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            background: "var(--bg-card2)",
            border: "1px solid var(--border)",
            color: value ? "var(--text)" : "var(--text-muted)",
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Building2 size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span className="text-sm truncate">{value || placeholder}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {value && (
              <button
                type="button"
                onClick={clearSelection}
                className="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-red-100 hover:text-red-500"
                style={{ color: "var(--text-muted)" }}
                aria-label="Limpiar selección"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown 
              size={16} 
              style={{ 
                color: "var(--text-muted)",
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </div>
        </div>

        {isOpen && (
          <div 
            className="absolute z-50 w-full mt-2 rounded-2xl shadow-2xl overflow-hidden"
            style={{ 
              background: "var(--bg-card)", 
              border: "1px solid var(--border)",
              maxHeight: '80vh'
            }}
          >
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                  style={{ 
                    background: "var(--bg-card2)", 
                    border: "1px solid var(--border)", 
                    color: "var(--text)" 
                  }}
                  placeholder="Buscar institución..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Filtros por tipo - responsive: scroll horizontal en móvil */}
            <div className="flex gap-1.5 p-3 border-b overflow-x-auto" style={{ borderColor: "var(--border)" }}>
              <button
                type="button"
                onClick={() => setSelectedTipo(null)}
                className={`text-xs px-3 py-1.5 rounded-full transition whitespace-nowrap flex-shrink-0 ${!selectedTipo ? "font-semibold" : ""}`}
                style={{
                  background: !selectedTipo ? "var(--accent-1)" : "var(--bg-card2)",
                  color: !selectedTipo ? "white" : "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Todas
              </button>
              {tipos.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setSelectedTipo(tipo.id)}
                  className={`text-xs px-3 py-1.5 rounded-full transition flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${selectedTipo === tipo.id ? "font-semibold" : ""}`}
                  style={{
                    background: selectedTipo === tipo.id ? "var(--accent-1)" : "var(--bg-card2)",
                    color: selectedTipo === tipo.id ? "white" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {tipo.icon}
                  <span className="hidden sm:inline">{tipo.label}</span>
                  <span className="sm:hidden">{tipo.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="max-h-64 sm:max-h-72 overflow-y-auto overscroll-contain p-2">
              {institucionesFiltradas.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                  No se encontraron instituciones
                </p>
              ) : (
                institucionesFiltradas.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => handleSelect(inst.nombre)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition hover:bg-gray-100"
                    style={{ color: "var(--text)" }}
                  >
                    <Check 
                      size={14} 
                      className="flex-shrink-0" 
                      style={{ 
                        color: "var(--accent-1)",
                        opacity: value === inst.nombre ? 1 : 0
                      }} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{inst.nombre}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                          {inst.tipo.replace("_", " ")}
                        </span>
                        {inst.acreditada && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                            ✓ Acreditada
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}