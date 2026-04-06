import { useState } from "react";
import type { CVFormData, ExperienceItem, EducationItem } from "../pages/types/cv.types";

interface Props {
  onSubmit: (data: CVFormData) => void;
  loading: boolean;
}

const emptyExperience: ExperienceItem = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyEducation: EducationItem = {
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
};

export default function CVForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<CVFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: [""],
    tools: [""],
    languages: [""],
  });

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass = "bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-blue-700 mb-4">Datos Personales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Título profesional</label>
            <input className={inputClass} value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input className={inputClass} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Ubicación</label>
            <input className={inputClass} value={form.location} onChange={(e) => updateField("location", e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Resumen profesional</label>
            <textarea className={inputClass} rows={3} value={form.summary} onChange={(e) => updateField("summary", e.target.value)} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-blue-700 mb-4">Experiencia Laboral</h2>
        {form.experience.map((exp, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Empresa</label>
                <input className={inputClass} value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Cargo</label>
                <input className={inputClass} value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Desde</label>
                <input className={inputClass} value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Hasta</label>
                <input className={inputClass} value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea className={inputClass} rows={2} value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => updateField("experience", [...form.experience, { ...emptyExperience }])}
          className="text-blue-600 text-sm font-medium hover:underline">
          + Agregar experiencia
        </button>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-blue-700 mb-4">Educación</h2>
        {form.education.map((edu, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Institución</label>
                <input className={inputClass} value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Título obtenido</label>
                <input className={inputClass} value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Desde</label>
                <input className={inputClass} value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Hasta</label>
                <input className={inputClass} value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => updateField("education", [...form.education, { ...emptyEducation }])}
          className="text-blue-600 text-sm font-medium hover:underline">
          + Agregar educación
        </button>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-blue-700 mb-4">Habilidades, Herramientas e Idiomas</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Habilidades</label>
            {form.skills.map((s, i) => (
              <input key={i} className={`${inputClass} mb-2`} value={s} onChange={(e) => updateListItem("skills", i, e.target.value)} placeholder="Ej: Trabajo en equipo" />
            ))}
            <button type="button" onClick={() => addListItem("skills")} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
          </div>
          <div>
            <label className={labelClass}>Herramientas</label>
            {form.tools.map((t, i) => (
              <input key={i} className={`${inputClass} mb-2`} value={t} onChange={(e) => updateListItem("tools", i, e.target.value)} placeholder="Ej: React, Figma" />
            ))}
            <button type="button" onClick={() => addListItem("tools")} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
          </div>
          <div>
            <label className={labelClass}>Idiomas</label>
            {form.languages.map((l, i) => (
              <input key={i} className={`${inputClass} mb-2`} value={l} onChange={(e) => updateListItem("languages", i, e.target.value)} placeholder="Ej: Español, Inglés" />
            ))}
            <button type="button" onClick={() => addListItem("languages")} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50">
        {loading ? "Generando..." : "Generar CV con IA"}
      </button>
    </form>
  );
}