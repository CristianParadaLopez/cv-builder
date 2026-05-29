// src/components/CVForm.tsx
// PASO 4 — IA Asistente en TODOS los campos relevantes
// Nuevos botones IA en: educación, skills, tools, certificaciones, voluntariados, proyectos
// Además: contextData dinámico para que la IA sepa el cargo/empresa/institución del usuario

import { useState, useCallback, useEffect } from "react";
import {
  Plus, Minus, User, Mail, Phone, MapPin, FileText, Building2,
  GraduationCap, Wrench, Languages, Loader2, ChevronRight,
  AlertTriangle, Sparkles, Award, Briefcase, Image as ImageIcon,
  Award as CertificateIcon, Heart, FolderOpen, Trash2,
  ChevronUp, ChevronDown,
} from "lucide-react";
import type {
  CVFormData, ExperienceItem, EducationItem,
  CertificationItem, VolunteerItem, ProjectItem,
} from "../pages/types/cv.types";
import { sanitizeInput, validateFormData, sanitizeFormData, LIMITS, type ValidationError } from "../utils/validation";
import ChainedSelect from "./ChainedSelect";
import PhotoUpload from "./PhotoUpload";
import AISuggestField from "./AISuggestField";
import HelpTooltip from "./HelpTooltip";
import { usePersistCV } from "../pages/hooks/usePersistCV";

// ─── PROPS ───────────────────────────────────────────────────

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (data: CVFormData) => void;
  loading: boolean;
  mode: "ats" | "designed";
}

// ─── VALORES VACÍOS ──────────────────────────────────────────

const emptyExperience: ExperienceItem = { company: "", position: "", startDate: "", endDate: "", description: "" };
const emptyEducation: EducationItem = { institution: "", degree: "", startDate: "", endDate: "" };
const emptyCertification: CertificationItem = { name: "", institution: "", date: "" };
const emptyVolunteer: VolunteerItem = { organization: "", role: "", startDate: "", endDate: "", description: "" };
const emptyProject: ProjectItem = { title: "", description: "", tech: [] };

// ─── HELPERS ─────────────────────────────────────────────────

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

  function estimatePages(form: CVFormData): number {
  let contentScore = 0;

  contentScore += form.summary.length > 200 ? 2 : 1;
  contentScore += form.experience.length * 3;
  contentScore += form.education.length * 1.5;
  contentScore += (form.certifications?.length || 0) * 1;
  contentScore += (form.volunteer?.length || 0) * 2;
  contentScore += (form.projects?.length || 0) * 2;
  contentScore += form.skills.filter(Boolean).length > 6 ? 1 : 0;

  return contentScore > 18 ? 2 : 1;
}

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

// ─── FORMULARIO ──────────────────────────────────────────────

export default function CVForm({ onSubmit, loading, mode }: Props) {
  const [step, setStep] = useState(1);
  const { persistedData, persistFormData } = usePersistCV();

  // Inicializar con datos persistidos si existen
  const [form, setForm] = useState<CVFormData>(() => {
    if (persistedData.formData) return persistedData.formData;
    return {
      name: "", email: "", phone: "", location: "", title: "", summary: "",
      experience: [{ ...emptyExperience }],
      education: [{ ...emptyEducation }],
      skills: [""], tools: [""], languages: [""],
      certifications: [],
      volunteer: [],
      projects: [],
      photo: undefined,
    };
  });

  const [expPresente, setExpPresente] = useState<boolean[]>(() =>
    (persistedData.formData?.experience || [{ ...emptyExperience }]).map(
      exp => exp.endDate === "Presente"
    )
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showOptional, setShowOptional] = useState(false);

  // Auto-persistir cada vez que cambia el form
  useEffect(() => {
    persistFormData(form);
  }, [form]);

  // ─── ACTUALIZACIÓN DE CAMPOS ──────────────────────────────

  const updateField = useCallback((field: keyof CVFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateListItem = (field: "skills" | "tools" | "languages", index: number, value: string) => {
    const updated = [...form[field]];
    updated[index] = sanitizeInput(value);
    updateField(field, updated);
  };

  const addListItem = (field: "skills" | "tools" | "languages", max: number) => {
    if (form[field].length >= max) return;
    updateField(field, [...form[field], ""]);
  };

  const removeListItem = (field: "skills" | "tools" | "languages", index: number) => {
    if (form[field].length <= 1) return;
    updateField(field, form[field].filter((_, i) => i !== index));
  };

  // Experience
  const updateExperience = (index: number, key: keyof ExperienceItem, value: string) => {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [key]: sanitizeInput(value) };
    updateField("experience", updated);
  };
  const addExperience = () => {
    if (form.experience.length >= LIMITS.EXPERIENCE_MAX) return;
    updateField("experience", [...form.experience, { ...emptyExperience }]);
    setExpPresente(prev => [...prev, false]);
  };
  const removeExperience = (index: number) => {
    if (form.experience.length <= 1) return;
    updateField("experience", form.experience.filter((_, i) => i !== index));
    setExpPresente(prev => prev.filter((_, i) => i !== index));
  };
  const togglePresente = (index: number, checked: boolean) => {
    const newPresente = [...expPresente];
    newPresente[index] = checked;
    setExpPresente(newPresente);
    const updated = [...form.experience];
    updated[index] = { ...updated[index], endDate: checked ? "Presente" : "" };
    updateField("experience", updated);
  };

  // Education
  const updateEducation = (index: number, key: keyof EducationItem, value: string) => {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [key]: sanitizeInput(value) };
    updateField("education", updated);
  };
  const addEducation = () => {
    if (form.education.length >= LIMITS.EDUCATION_MAX) return;
    updateField("education", [...form.education, { ...emptyEducation }]);
  };
  const removeEducation = (index: number) => {
    if (form.education.length <= 1) return;
    updateField("education", form.education.filter((_, i) => i !== index));
  };

  // Certifications
  const updateCertification = (index: number, key: keyof CertificationItem, value: string) => {
    const updated = [...(form.certifications || [])];
    updated[index] = { ...updated[index], [key]: sanitizeInput(value) };
    updateField("certifications", updated);
  };
  const addCertification = () => {
    if ((form.certifications?.length || 0) >= LIMITS.CERTIFICATIONS_MAX) return;
    updateField("certifications", [...(form.certifications || []), { ...emptyCertification }]);
  };
  const removeCertification = (index: number) => {
    updateField("certifications", (form.certifications || []).filter((_, i) => i !== index));
  };

  // Volunteer
  const updateVolunteer = (index: number, key: keyof VolunteerItem, value: string) => {
    const updated = [...(form.volunteer || [])];
    updated[index] = { ...updated[index], [key]: sanitizeInput(value) };
    updateField("volunteer", updated);
  };
  const addVolunteer = () => {
    if ((form.volunteer?.length || 0) >= LIMITS.VOLUNTEER_MAX) return;
    updateField("volunteer", [...(form.volunteer || []), { ...emptyVolunteer }]);
  };
  const removeVolunteer = (index: number) => {
    updateField("volunteer", (form.volunteer || []).filter((_, i) => i !== index));
  };

  // Projects
  const updateProject = (index: number, key: keyof ProjectItem, value: any) => {
    const updated = [...(form.projects || [])];
    updated[index] = { ...updated[index], [key]: value };
    updateField("projects", updated);
  };
  const addProject = () => {
    if ((form.projects?.length || 0) >= LIMITS.PROJECTS_MAX) return;
    updateField("projects", [...(form.projects || []), { ...emptyProject }]);
  };
  const removeProject = (index: number) => {
    updateField("projects", (form.projects || []).filter((_, i) => i !== index));
  };

  // ─── VALIDACIÓN ──────────────────────────────────────────

  const validateStep = (s: number): boolean => {
    const validationErrors = validateFormData(form);
    const stepErrors = validationErrors.filter(e => {
      if (s === 1) return e.section === "personal";
      if (s === 2) return e.section === "experience";
      if (s === 3) return e.section === "education";
      if (s === 4) return ["skills", "tools", "languages"].some(f => e.field.startsWith(f));
      return false;
    });
    setErrors(stepErrors);
    return stepErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setErrors([]);
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth' });
  }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      const sanitized = sanitizeFormData(form);
      onSubmit(prepareFormData(sanitized));
    }
  };

  const sectionCard = "glass-card rounded-2xl p-6 mb-4";

  // ─── RENDER ──────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} autoComplete="on" className="max-w-5xl mx-auto">

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="rounded-2xl p-4 mb-6 animate-slide-up"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="text-sm font-semibold mb-2 text-red-400">
                Corregí estos errores antes de continuar:
              </p>
              <ul className="space-y-1">
                {errors.map((err, i) => (
                  <li key={i} className="text-sm flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: step >= s ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))" : "var(--bg-card2)",
                border: "1px solid var(--border)",
                color: step >= s ? "white" : "var(--text-muted)",
              }}
            >
              {s}
            </div>
            {s < 4 && <div className="w-8 h-px" style={{ background: step > s ? "var(--accent-1)" : "var(--border)" }} />}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          STEP 1 — Datos Personales + Foto
      ══════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-6">
          <div className={sectionCard}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={18} style={{ color: "var(--accent-1)" }} />
              Datos Personales
              <HelpTooltip
                title="Datos de contacto"
                content="Estos datos aparecerán en la parte superior de tu CV. Asegurate de que sean correctos porque los reclutadores los usarán para contactarte."
                type="info"
              />
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Nombre completo
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input
                    required type="text"
                    className="input-field pl-10 w-full"
                    placeholder="Ej: Juan Pérez García"
                    value={form.name}
                    maxLength={LIMITS.NAME_MAX}
                    onChange={(e) => updateField("name", sanitizeInput(e.target.value))}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{form.name.length}/{LIMITS.NAME_MAX}</p>
              </div>

              {/* Título profesional con ChainedSelect */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Título profesional / Cargo
                  <HelpTooltip title="Título" content="Elegí el cargo que mejor describa tu perfil. Esto ayuda a la IA a generar un CV más preciso." type="tip" />
                </label>
                <ChainedSelect
                  type="profession"
                  value={form.title}
                  onChange={(val) => updateField("title", val)}
                  placeholder="Seleccionar cargo..."
                />
                <input
                  type="text"
                  className="input-field w-full mt-2"
                  placeholder="O escribí tu título aquí..."
                  value={form.title}
                  maxLength={LIMITS.TITLE_MAX}
                  onChange={(e) => updateField("title", sanitizeInput(e.target.value))}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input
                    required type="email"
                    className="input-field pl-10 w-full"
                    placeholder="correo@email.com"
                    value={form.email}
                    maxLength={LIMITS.EMAIL_MAX}
                    onChange={(e) => updateField("email", sanitizeInput(e.target.value).toLowerCase())}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Teléfono</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input
                    required type="tel"
                    className="input-field pl-10 w-full"
                    placeholder="+503 7000-0000"
                    value={form.phone}
                    maxLength={LIMITS.PHONE_MAX}
                    onChange={(e) => updateField("phone", sanitizeInput(e.target.value))}
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Ubicación</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input
                    required
                    className="input-field pl-10 w-full"
                    placeholder="Ej: San Salvador, El Salvador"
                    value={form.location}
                    maxLength={LIMITS.LOCATION_MAX}
                    onChange={(e) => updateField("location", sanitizeInput(e.target.value))}
                  />
                </div>
              </div>

              {/* Resumen con IA */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Resumen profesional
                  <HelpTooltip title="Resumen" content="Esta es la primera sección que lee un reclutador. Debe resumir quién sos, qué hacés y qué buscás en 3-4 líneas." type="tip" />
                </label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-4" style={{ color: "var(--text-muted)" }} />
                  <textarea
                    required rows={4}
                    className="input-field pl-10 resize-none w-full"
                    placeholder="Breve descripción de tu perfil profesional..."
                    value={form.summary}
                    maxLength={LIMITS.SUMMARY_MAX}
                    onChange={(e) => updateField("summary", sanitizeInput(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{form.summary.length}/{LIMITS.SUMMARY_MAX}</p>
                  {/* IA ASISTENTE — Resumen con contexto del título */}
                  <AISuggestField
                    fieldLabel="Resumen profesional"
                    placeholder="Ej: Soy estudiante de computación, me gusta programar y quiero trabajar en tech..."
                    onAccept={(text) => updateField("summary", text)}
                    context="summary"
                    currentValue={form.summary}
                    contextData={{ title: form.title }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Foto de perfil */}
          <div className={sectionCard}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon size={18} style={{ color: "var(--accent-1)" }} />
              Foto de perfil
              <HelpTooltip
                title="Foto"
                content={mode === "ats"
                  ? "En modo ATS no se incluye foto. Los sistemas automáticos pueden rechazar CVs con fotos."
                  : "Una foto profesional aumenta la confianza. Fondo neutro, ropa formal, sonrisa natural."}
                type={mode === "ats" ? "warning" : "info"}
              />
            </h3>
            <PhotoUpload
              photo={form.photo ?? null}
              onPhotoChange={(photo) => updateField("photo", photo)}
              mode={mode}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 2 — Experiencia Laboral
      ══════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Building2 size={18} style={{ color: "var(--accent-1)" }} />
              Experiencia Laboral
              <HelpTooltip
                title="Experiencia"
                content="¡Todo cuenta! Trabajos formales, horas sociales, prácticas profesionales, proyectos universitarios y trabajo informal. Máximo 5 experiencias."
                type="info"
              />
            </h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {form.experience.length}/{LIMITS.EXPERIENCE_MAX}
            </span>
          </div>

          {form.experience.map((exp, i) => (
            <div key={i} className="rounded-xl p-5 mb-4" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Experiencia #{i + 1}
                </p>
                {form.experience.length > 1 && (
                  <button type="button" onClick={() => removeExperience(i)}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition hover:bg-red-100"
                    style={{ color: "#ef4444" }}>
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  required className="input-field"
                  placeholder="Empresa"
                  value={exp.company}
                  maxLength={LIMITS.COMPANY_MAX}
                  onChange={(e) => updateExperience(i, "company", e.target.value)}
                />
                <input
                  required className="input-field"
                  placeholder="Cargo / Puesto"
                  value={exp.position}
                  maxLength={LIMITS.POSITION_MAX}
                  onChange={(e) => updateExperience(i, "position", e.target.value)}
                />

                {/* Fechas */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Desde</label>
                  <input
                    required
                    type={exp.startDate ? "month" : "text"}
                    placeholder="Ej: 2025-04"
                    className="input-field"
                    value={exp.startDate}
                    onFocus={(e) => (e.target.type = "month")}
                    onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                    onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
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
                    <input className="input-field" value="Presente" disabled style={{ opacity: 0.6 }} />
                  ) : (
                    <input
                      required
                      type={exp.endDate && exp.endDate !== "Presente" ? "month" : "text"}
                      placeholder="Ej. 2025-12"
                      className="input-field"
                      value={exp.endDate === "Presente" ? "" : exp.endDate}
                      onFocus={(e) => (e.target.type = "month")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                      onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                      style={{ colorScheme: "dark" }}
                    />
                  )}
                </div>

                {/* Descripción con IA — ahora con contextData de empresa y cargo */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    Descripción de responsabilidades
                  </label>
                  <textarea
                    required rows={3}
                    className="input-field resize-none w-full"
                    placeholder="Describe tus responsabilidades y logros..."
                    value={exp.description}
                    maxLength={LIMITS.DESCRIPTION_MAX}
                    onChange={(e) => updateExperience(i, "description", e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {exp.description.length}/{LIMITS.DESCRIPTION_MAX}
                    </p>
                    {/* IA ASISTENTE — Experiencia con empresa+cargo como contexto */}
                    <AISuggestField
                      fieldLabel={`Experiencia #${i + 1}${exp.position ? ` — ${exp.position}` : ""}`}
                      placeholder="Ej: Ayudé a mi tío en construcción 2 años, aprendí a hacer cemento y trabajar en equipo..."
                      onAccept={(text) => updateExperience(i, "description", text)}
                      context="experience"
                      currentValue={exp.description}
                      contextData={{
                        title: form.title,
                        company: exp.company,
                        position: exp.position,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {form.experience.length < LIMITS.EXPERIENCE_MAX && (
            <button type="button" onClick={addExperience}
              className="flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
              style={{ color: "var(--accent-1)" }}>
              <Plus size={15} /> Agregar experiencia ({LIMITS.EXPERIENCE_MAX - form.experience.length} restantes)
            </button>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 3 — Educación
      ══════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className={sectionCard}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap size={18} style={{ color: "var(--accent-1)" }} />
              Educación
              <HelpTooltip
                title="Educación"
                content="Incluí desde noveno grado hasta tu formación más alta. Las instituciones acreditadas tienen más peso para reclutadores."
                type="info"
              />
            </h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {form.education.length}/{LIMITS.EDUCATION_MAX}
            </span>
          </div>

          {form.education.map((edu, i) => (
            <div key={i} className="rounded-xl p-5 mb-4" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Formación #{i + 1}
                </p>
                {form.education.length > 1 && (
                  <button type="button" onClick={() => removeEducation(i)}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition hover:bg-red-100"
                    style={{ color: "#ef4444" }}>
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {/* Institución con ChainedSelect */}
                <div className="md:col-span-2">
                  <ChainedSelect
                    type="institution"
                    value={edu.institution}
                    onChange={(val) => updateEducation(i, "institution", val)}
                    placeholder="Seleccionar institución..."
                    label="Institución educativa"
                  />
                  <input
                    className="input-field w-full mt-2"
                    placeholder="O escribí la institución manualmente..."
                    value={edu.institution}
                    maxLength={LIMITS.INSTITUTION_MAX}
                    onChange={(e) => updateEducation(i, "institution", e.target.value)}
                  />
                </div>

                <input
                  required className="input-field"
                  placeholder="Título / Carrera"
                  value={edu.degree}
                  maxLength={LIMITS.DEGREE_MAX}
                  onChange={(e) => updateEducation(i, "degree", e.target.value)}
                />

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Año de inicio</label>
                  <input
                    required type="number" className="input-field"
                    placeholder="Ej: 2018"
                    min={1960} max={new Date().getFullYear()}
                    value={edu.startDate}
                    onChange={(e) => updateEducation(i, "startDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Año de fin</label>
                  <input
                    required type="number" className="input-field"
                    placeholder="Ej: 2022"
                    min={1960} max={new Date().getFullYear() + 6}
                    value={edu.endDate}
                    onChange={(e) => updateEducation(i, "endDate", e.target.value)}
                  />
                </div>

                
              </div>
            </div>
          ))}

          {form.education.length < LIMITS.EDUCATION_MAX && (
            <button type="button" onClick={addEducation}
              className="flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
              style={{ color: "var(--accent-1)" }}>
              <Plus size={15} /> Agregar educación ({LIMITS.EDUCATION_MAX - form.education.length} restantes)
            </button>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 4 — Habilidades + Secciones Opcionales
      ══════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="space-y-6">
          <div
          className="rounded-xl p-3 mb-4 flex items-center gap-2"
          style={{
            background:
              estimatePages(form) > 1
                ? "rgba(245,158,11,0.1)"
                : "rgba(16,185,129,0.1)",
            border: `1px solid ${
              estimatePages(form) > 1 ? "#f59e0b" : "#10b981"
            }`,
          }}
        >
          <span
            style={{
              color: estimatePages(form) > 1 ? "#f59e0b" : "#10b981",
            }}
          >
            {estimatePages(form) > 1
              ? "⚠️ Estimado: 2 páginas"
              : "✅ Estimado: 1 página"}
          </span>

          <span
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {estimatePages(form) > 1
              ? "— Considerá reducir descripciones para que entre en 1 página"
              : "— Tu CV entrará bien en 1 página"}
          </span>
        </div>
          {/* Skills, Tools, Languages */}
          <div className={sectionCard}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wrench size={18} style={{ color: "var(--accent-1)" }} />
              Habilidades y Herramientas
            </h3>

            {/* ━━━ NUEVO: IA para Skills y Tools globales ━━━ */}
            <div
              className="rounded-xl p-3 mb-5"
              style={{ background: "rgba(124,58,237,0.05)", border: "1px dashed rgba(124,58,237,0.2)" }}
            >
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#7C3AED" }}>
                <Sparkles size={12} />
                ¿No sabés qué habilidades o herramientas listar?
              </p>
              <div className="flex flex-wrap gap-3">
                {/* IA para skills */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Para habilidades:</span>
                  <AISuggestField
                    fieldLabel="Habilidades blandas"
                    placeholder="Ej: Soy bueno trabajando en equipo, me adapto rápido y aprendo solo..."
                    onAccept={(text) => {
                      // Parsear las líneas como skills individuales
                      const newSkills = text
                        .split("\n")
                        .map(s => s.replace(/^[-•*]\s*/, "").trim())
                        .filter(Boolean)
                        .slice(0, LIMITS.SKILLS_MAX);
                      if (newSkills.length > 0) {
                        updateField("skills", newSkills);
                      }
                    }}
                    context="skills"
                    currentValue={form.skills.filter(Boolean).join(", ")}
                    contextData={{ title: form.title }}
                    compact
                  />
                </div>
                {/* IA para tools */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Para herramientas:</span>
                  <AISuggestField
                    fieldLabel="Herramientas técnicas"
                    placeholder="Ej: Uso el Excel, Photoshop básico, sé algo de Python y manejo Word bien..."
                    onAccept={(text) => {
                      // Parsear herramientas
                      const newTools = text
                        .split("\n")
                        .map(t => t.replace(/^[-•*]\s*/, "").trim())
                        .filter(Boolean)
                        .slice(0, LIMITS.TOOLS_MAX);
                      if (newTools.length > 0) {
                        updateField("tools", newTools);
                      }
                    }}
                    context="tools"
                    currentValue={form.tools.filter(Boolean).join(", ")}
                    contextData={{ title: form.title }}
                    compact
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Habilidades", field: "skills" as const, icon: Award, placeholder: "Ej: Liderazgo", max: LIMITS.SKILLS_MAX, aiContext: "skills" as const },
                { label: "Herramientas", field: "tools" as const, icon: Wrench, placeholder: "Ej: React, Figma", max: LIMITS.TOOLS_MAX, aiContext: "tools" as const },
                { label: "Idiomas", field: "languages" as const, icon: Languages, placeholder: "Ej: Inglés B2", max: LIMITS.LANGUAGES_MAX, aiContext: null },
              ].map(({ label, field, icon: Icon, placeholder, max }) => (
                <div key={field}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                      <Icon size={13} /> {label}
                    </label>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {form[field].length}/{max}
                    </span>
                  </div>

                  {form[field].map((val, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                        required
                        className="input-field flex-1"
                        placeholder={placeholder}
                        value={val}
                        maxLength={LIMITS.SKILL_MAX}
                        onChange={(e) => updateListItem(field, i, e.target.value)}
                      />
                      {form[field].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeListItem(field, i)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-red-100"
                          style={{ color: "#ef4444" }}
                        >
                          <Minus size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {form[field].length < max && (
                    <button
                      type="button"
                      onClick={() => addListItem(field, max)}
                      className="flex items-center gap-1 text-xs font-semibold mt-1 transition hover:opacity-80"
                      style={{ color: "var(--accent-1)" }}
                    >
                      <Plus size={13} /> Agregar ({max - form[field].length} restantes)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ Secciones Opcionales ━━━ */}
          <div className={sectionCard}>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: "var(--accent-2)" }} />
                <h3 className="text-xl font-bold">Secciones opcionales</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  Recomendado
                </span>
              </div>
              {showOptional ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {!showOptional && (
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                Agregá certificaciones, voluntariados y proyectos para destacar más.
                Solo el 22% de los CVs incluyen certificaciones.
              </p>
            )}

            {showOptional && (
              <div className="mt-6 space-y-8 animate-slide-up">

                {/* ━━━ CERTIFICACIONES ━━━ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CertificateIcon size={16} style={{ color: "var(--accent-1)" }} />
                      Certificaciones y Cursos
                      <HelpTooltip
                        title="Certificaciones"
                        content="Incluí cursos de Coursera, Udemy, freeCodeCamp o certificaciones profesionales. Mencioná la institución emisora y fecha."
                        type="tip"
                      />
                    </h4>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {(form.certifications?.length || 0)}/{LIMITS.CERTIFICATIONS_MAX}
                    </span>
                  </div>

                  {form.certifications?.map((cert, i) => (
                    <div key={i} className="rounded-lg p-4 mb-3" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Certificación #{i + 1}</span>
                        <button type="button" onClick={() => removeCertification(i)}
                          className="text-xs flex items-center gap-1 transition hover:opacity-70"
                          style={{ color: "#ef4444" }}>
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          className="input-field"
                          placeholder="Nombre de la certificación"
                          value={cert.name}
                          maxLength={100}
                          onChange={(e) => updateCertification(i, "name", e.target.value)}
                        />
                        <input
                          className="input-field"
                          placeholder="Institución emisora (ej: Coursera)"
                          value={cert.institution}
                          maxLength={100}
                          onChange={(e) => updateCertification(i, "institution", e.target.value)}
                        />
                        <input
                          type="month" className="input-field"
                          placeholder="Fecha"
                          value={cert.date}
                          onChange={(e) => updateCertification(i, "date", e.target.value)}
                        />
                        <input
                          className="input-field"
                          placeholder="URL del certificado (opcional)"
                          value={cert.url || ""}
                          maxLength={200}
                          onChange={(e) => updateCertification(i, "url", e.target.value)}
                        />
                      </div>

                      {/* ━━━ NUEVO: IA en Certificación ━━━ */}
                      {cert.name && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            Generar descripción de esta cert:
                          </span>
                          <AISuggestField
                            fieldLabel={`Certificación — ${cert.name}`}
                            placeholder="Ej: Aprendí a usar Excel avanzado, tablas dinámicas, macros básicas y análisis de datos..."
                            onAccept={(text) => updateCertification(i, "url", text)} // guardamos como contexto
                            context="certification"
                            contextData={{ title: form.title }}
                            compact
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {(form.certifications?.length || 0) < LIMITS.CERTIFICATIONS_MAX && (
                    <button type="button" onClick={addCertification}
                      className="flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
                      style={{ color: "var(--accent-1)" }}>
                      <Plus size={14} /> Agregar certificación
                    </button>
                  )}
                </div>

                {/* ━━━ VOLUNTARIADOS ━━━ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Heart size={16} style={{ color: "var(--accent-1)" }} />
                      Voluntariados / Horas Sociales
                      <HelpTooltip
                        title="Voluntariados"
                        content="Las horas sociales y prácticas profesionales cuentan como experiencia válida. Describí tus responsabilidades con verbos de acción."
                        type="tip"
                      />
                    </h4>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {(form.volunteer?.length || 0)}/{LIMITS.VOLUNTEER_MAX}
                    </span>
                  </div>

                  {form.volunteer?.map((vol, i) => (
                    <div key={i} className="rounded-lg p-4 mb-3" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Voluntariado #{i + 1}</span>
                        <button type="button" onClick={() => removeVolunteer(i)}
                          className="text-xs flex items-center gap-1 transition hover:opacity-70"
                          style={{ color: "#ef4444" }}>
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          className="input-field"
                          placeholder="Organización"
                          value={vol.organization}
                          maxLength={100}
                          onChange={(e) => updateVolunteer(i, "organization", e.target.value)}
                        />
                        <input
                          className="input-field"
                          placeholder="Rol / Cargo"
                          value={vol.role}
                          maxLength={100}
                          onChange={(e) => updateVolunteer(i, "role", e.target.value)}
                        />
                        <input
                          type="month" className="input-field"
                          placeholder="Desde"
                          value={vol.startDate}
                          onChange={(e) => updateVolunteer(i, "startDate", e.target.value)}
                        />
                        <input
                          type="month" className="input-field"
                          placeholder="Hasta"
                          value={vol.endDate}
                          onChange={(e) => updateVolunteer(i, "endDate", e.target.value)}
                        />
                        <textarea
                          className="input-field resize-none md:col-span-2" rows={2}
                          placeholder="Descripción de actividades..."
                          value={vol.description}
                          maxLength={400}
                          onChange={(e) => updateVolunteer(i, "description", e.target.value)}
                        />
                        {/* Contador + IA */}
                        <div className="md:col-span-2 flex items-center justify-between">
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {vol.description.length}/400
                          </p>
                          {/* ━━━ NUEVO: IA en Voluntariado ━━━ */}
                          <AISuggestField
                            fieldLabel={`Voluntariado — ${vol.organization || "Organización"}`}
                            placeholder="Ej: Di clases a niños de zonas rurales en mis horas sociales de la universidad durante 6 meses..."
                            onAccept={(text) => updateVolunteer(i, "description", text)}
                            context="volunteer"
                            currentValue={vol.description}
                            contextData={{
                              title: form.title,
                              organization: vol.organization,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(form.volunteer?.length || 0) < LIMITS.VOLUNTEER_MAX && (
                    <button type="button" onClick={addVolunteer}
                      className="flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
                      style={{ color: "var(--accent-1)" }}>
                      <Plus size={14} /> Agregar voluntariado
                    </button>
                  )}
                </div>

                {/* ━━━ PROYECTOS ━━━ */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FolderOpen size={16} style={{ color: "var(--accent-1)" }} />
                      Proyectos Académicos / Personales
                      <HelpTooltip
                        title="Proyectos"
                        content="Incluí proyectos de universidad, personales o freelance. Mencioná las tecnologías usadas y resultados concretos."
                        type="tip"
                      />
                    </h4>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {(form.projects?.length || 0)}/{LIMITS.PROJECTS_MAX}
                    </span>
                  </div>

                  {form.projects?.map((proj, i) => (
                    <div key={i} className="rounded-lg p-4 mb-3" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Proyecto #{i + 1}</span>
                        <button type="button" onClick={() => removeProject(i)}
                          className="text-xs flex items-center gap-1 transition hover:opacity-70"
                          style={{ color: "#ef4444" }}>
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <input
                          className="input-field"
                          placeholder="Título del proyecto"
                          value={proj.title}
                          maxLength={100}
                          onChange={(e) => updateProject(i, "title", e.target.value)}
                        />
                        <input
                          className="input-field"
                          placeholder="URL (opcional, ej: github.com/...)"
                          value={proj.url || ""}
                          maxLength={200}
                          onChange={(e) => updateProject(i, "url", e.target.value)}
                        />
                        <textarea
                          className="input-field resize-none md:col-span-2" rows={2}
                          placeholder="Descripción del proyecto..."
                          value={proj.description}
                          maxLength={500}
                          onChange={(e) => updateProject(i, "description", e.target.value)}
                        />
                        {/* Contador + IA */}
                        <div className="md:col-span-2 flex items-center justify-between">
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {proj.description.length}/500
                          </p>
                          {/* ━━━ NUEVO: IA en Proyecto ━━━ */}
                          <AISuggestField
                            fieldLabel={`Proyecto — ${proj.title || "Sin título"}`}
                            placeholder="Ej: Hice una app para llevar registro de gastos con React y guardaba los datos en Firebase..."
                            onAccept={(text) => updateProject(i, "description", text)}
                            context="project"
                            currentValue={proj.description}
                            contextData={{ title: form.title }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>
                            Tecnologías (separadas por coma)
                          </label>
                          <input
                            className="input-field w-full"
                            placeholder="Ej: React, Node.js, MongoDB, Firebase"
                            value={proj.tech.join(", ")}
                            maxLength={200}
                            onChange={(e) => updateProject(i, "tech", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(form.projects?.length || 0) < LIMITS.PROJECTS_MAX && (
                    <button type="button" onClick={addProject}
                      className="flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
                      style={{ color: "var(--accent-1)" }}>
                      <Plus size={14} /> Agregar proyecto
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          NAVEGACIÓN
      ══════════════════════════════════════════════════════ */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => { setStep(step - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="btn-ghost flex items-center gap-2"
          >
            ← Volver
          </button>
        )}

        {step < 4 ? (
          <button type="button" onClick={handleNext}
            className="btn-primary flex items-center gap-2 ml-auto">
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => {
              if (loading) e.preventDefault();
            }}
            className="btn-primary flex items-center gap-2 ml-auto"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Generando CV..." : "Generar CV con IA"}
          </button>
        )}
      </div>
    </form>
  );
}