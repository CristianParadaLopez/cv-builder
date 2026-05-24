import { useState } from "react";
import { Plus, User, Mail, Phone, MapPin, FileText, Building2, Award, GraduationCap, Wrench, Languages, Loader2, ChevronRight } from "lucide-react";
import type { CVFormData, ExperienceItem, EducationItem } from "../pages/types/cv.types";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (data: CVFormData) => void;
  loading: boolean;
}

const emptyExperience: ExperienceItem = { company: "", position: "", startDate: "", endDate: "", description: "" };
const emptyEducation: EducationItem = { institution: "", degree: "", startDate: "", endDate: "" };

// Convierte "2022-03" → "Mar 2022" (solo para el submit final)
function formatMonthYear(value: string): string {
  if (!value || value === "Presente") return value;
  const parts = value.split("-");
  if (parts.length !== 2) return value;
  const [year, month] = parts;
  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const m = parseInt(month, 10);
  if (isNaN(m) || m < 1 || m > 12) return value;
  return `${monthNames[m - 1]} ${year}`;
}

// Prepara el form convirtiendo fechas al formato legible antes de enviar
function prepareFormData(form: CVFormData): CVFormData {
  return {
    ...form,
    experience: form.experience.map(exp => ({
      ...exp,
      startDate: formatMonthYear(exp.startDate),
      endDate: exp.endDate === "Presente" ? "Presente" : formatMonthYear(exp.endDate),
    })),
  };
}

export default function CVForm({ onSubmit, loading }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CVFormData>({
    name: "", email: "", phone: "", location: "", title: "", summary: "",
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: [""], tools: [""], languages: [""],
  });

  // Guarda si "endDate" de experiencia es "Presente"
  const [expPresente, setExpPresente] = useState<boolean[]>([false]);

  function updateField(field: keyof CVFormData, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateListItem(field: "skills" | "tools" | "languages", index: number, value: string) {
    const updated = [...form[field]];
    updated[index] = value;
    updateField(field, updated);
  }

  function addListItem(field: "skills" | "tools" | "languages") {
    updateField(field, [...form[field], ""]);
  }

  function updateExperience(index: number, key: keyof ExperienceItem, value: string) {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [key]: value };
    updateField("experience", updated);
  }

  function updateEducation(index: number, key: keyof EducationItem, value: string) {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [key]: value };
    updateField("education", updated);
  }

  // Maneja el checkbox "Presente" para experiencia
  function togglePresente(index: number, checked: boolean) {
    const newPresente = [...expPresente];
    newPresente[index] = checked;
    setExpPresente(newPresente);
    const updated = [...form.experience];
    updated[index] = { ...updated[index], endDate: checked ? "Presente" : "" };
    updateField("experience", updated);
  }

  function validateStep(s: number) {
    if (s === 1) {
      if (!form.name.trim() || !form.title.trim() || !form.email.trim() || !form.phone.trim() || !form.location.trim() || !form.summary.trim()) {
        alert("Completá todos los datos personales"); return false;
      }
    }
    if (s === 2) {
      if (form.experience.some(e => !e.company.trim() || !e.position.trim() || !e.startDate.trim() || !e.endDate.trim() || !e.description.trim())) {
        alert("Completá toda la experiencia laboral"); return false;
      }
    }
    if (s === 3) {
      if (form.education.some(e => !e.institution.trim() || !e.degree.trim() || !e.startDate.trim() || !e.endDate.trim())) {
        alert("Completá toda la educación"); return false;
      }
    }
    if (s === 4) {
      if (form.skills.some(s => !s.trim()) || form.tools.some(t => !t.trim()) || form.languages.some(l => !l.trim())) {
        alert("Completá habilidades, herramientas e idiomas"); return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) setStep(step + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep(4)) onSubmit(prepareFormData(form));
  }

  const sectionCard = "glass-card rounded-2xl p-6 mb-4";

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      {/* Inner Steps */}
      <div className="flex items-center gap-2 justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all`}
              style={{
                background: step >= s ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))" : "var(--bg-card2)",
                border: "1px solid var(--border)",
                color: step >= s ? "white" : "var(--text-muted)",
              }}>{s}</div>
            {s < 4 && <div className="w-8 h-px" style={{ background: step > s ? "var(--accent-1)" : "var(--border)" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Personal */}
      {step === 1 && (
        <div className={sectionCard}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User size={18} style={{ color: "var(--accent-1)" }} /> Datos Personales
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Nombre completo", field: "name", icon: User, type: "text", placeholder: "Ej: Juan Pérez" },
              { label: "Título profesional", field: "title", icon: Award, type: "text", placeholder: "Ej: Frontend Developer" },
              { label: "Correo electrónico", field: "email", icon: Mail, type: "email", placeholder: "correo@email.com" },
              { label: "Teléfono", field: "phone", icon: Phone, type: "tel", placeholder: "+503 7000-0000" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.field}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    {f.label}
                  </label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input
                      required type={f.type}
                      className="input-field pl-10"
                      placeholder={f.placeholder}
                      value={(form as any)[f.field]}
                      onChange={(e) => updateField(f.field as keyof CVFormData, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Ubicación</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input required className="input-field pl-10" placeholder="Ej: San Salvador, El Salvador"
                  value={form.location} onChange={(e) => updateField("location", e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Resumen profesional</label>
              <div className="relative">
                <FileText size={15} className="absolute left-3.5 top-4" style={{ color: "var(--text-muted)" }} />
                <textarea required rows={4} className="input-field pl-10 resize-none"
                  placeholder="Breve descripción de tu perfil profesional..."
                  value={form.summary} onChange={(e) => updateField("summary", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Experience */}
      {step === 2 && (
        <div className={sectionCard}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 size={18} style={{ color: "var(--accent-1)" }} /> Experiencia Laboral
          </h3>
          {form.experience.map((exp, i) => (
            <div key={i} className="rounded-xl p-5 mb-4" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                Experiencia #{i + 1}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <input required className="input-field" placeholder="Empresa" value={exp.company}
                  onChange={(e) => updateExperience(i, "company", e.target.value)} />
                <input required className="input-field" placeholder="Cargo / Puesto" value={exp.position}
                  onChange={(e) => updateExperience(i, "position", e.target.value)} />

                {/* Fecha Desde — tipo month */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    Desde
                  </label>
                  <input
                    required
                    type="month"
                    className="input-field"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                {/* Fecha Hasta — tipo month o "Presente" */}
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-3" style={{ color: "var(--text-muted)" }}>
                    Hasta
                    <span className="flex items-center gap-1.5 ml-2">
                      <input
                        type="checkbox"
                        id={`presente-${i}`}
                        checked={expPresente[i] ?? false}
                        onChange={(e) => togglePresente(i, e.target.checked)}
                        className="rounded"
                        style={{ accentColor: "var(--accent-1)" }}
                      />
                      <label htmlFor={`presente-${i}`} className="text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>
                        Actualmente aquí
                      </label>
                    </span>
                  </label>
                  {expPresente[i] ? (
                    <input
                      className="input-field"
                      value="Presente"
                      disabled
                      style={{ opacity: 0.6 }}
                    />
                  ) : (
                    <input
                      required
                      type="month"
                      className="input-field"
                      value={exp.endDate === "Presente" ? "" : exp.endDate}
                      onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                      style={{ colorScheme: "dark" }}
                    />
                  )}
                </div>

                <textarea required rows={3} className="input-field md:col-span-2 resize-none"
                  placeholder="Describe tus responsabilidades y logros..."
                  value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => {
              updateField("experience", [...form.experience, { ...emptyExperience }]);
              setExpPresente([...expPresente, false]);
            }}
            className="flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
            style={{ color: "var(--accent-1)" }}>
            <Plus size={15} /> Agregar experiencia
          </button>
        </div>
      )}

      {/* STEP 3 — Education */}
      {step === 3 && (
        <div className={sectionCard}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap size={18} style={{ color: "var(--accent-1)" }} /> Educación
          </h3>
          {form.education.map((edu, i) => (
            <div key={i} className="rounded-xl p-5 mb-4" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                Formación #{i + 1}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <input required className="input-field" placeholder="Institución educativa" value={edu.institution}
                  onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                <input required className="input-field" placeholder="Título / Carrera" value={edu.degree}
                  onChange={(e) => updateEducation(i, "degree", e.target.value)} />

                {/* Año Desde — tipo number */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    Año de inicio
                  </label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    placeholder="Ej: 2018"
                    min={1950}
                    max={new Date().getFullYear()}
                    value={edu.startDate}
                    onChange={(e) => updateEducation(i, "startDate", e.target.value)}
                  />
                </div>

                {/* Año Hasta — tipo number */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    Año de fin
                  </label>
                  <input
                    required
                    type="number"
                    className="input-field"
                    placeholder="Ej: 2022"
                    min={1950}
                    max={new Date().getFullYear() + 6}
                    value={edu.endDate}
                    onChange={(e) => updateEducation(i, "endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => updateField("education", [...form.education, { ...emptyEducation }])}
            className="flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
            style={{ color: "var(--accent-1)" }}>
            <Plus size={15} /> Agregar educación
          </button>
        </div>
      )}

      {/* STEP 4 — Skills */}
      {step === 4 && (
        <div className={sectionCard}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Wrench size={18} style={{ color: "var(--accent-1)" }} /> Habilidades y Herramientas
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Habilidades", field: "skills" as const, icon: Award, placeholder: "Ej: Liderazgo" },
              { label: "Herramientas", field: "tools" as const, icon: Wrench, placeholder: "Ej: React, Figma" },
              { label: "Idiomas", field: "languages" as const, icon: Languages, placeholder: "Ej: Inglés B2" },
            ].map(({ label, field, icon: Icon, placeholder }) => (
              <div key={field}>
                <label className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                  <Icon size={13} /> {label}
                </label>
                {form[field].map((val, i) => (
                  <input key={i} required className="input-field mb-2" placeholder={placeholder}
                    value={val} onChange={(e) => updateListItem(field, i, e.target.value)} />
                ))}
                <button type="button" onClick={() => addListItem(field)}
                  className="flex items-center gap-1 text-xs font-semibold mt-1 transition hover:opacity-80"
                  style={{ color: "var(--accent-1)" }}>
                  <Plus size={13} /> Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-end mt-6">
        {step < 4 ? (
          <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Generando CV..." : "Generar CV con IA"}
          </button>
        )}
      </div>
    </form>
  );
}