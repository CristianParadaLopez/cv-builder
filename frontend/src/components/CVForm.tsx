import { useState } from "react";
import type {
  CVFormData,
  ExperienceItem,
  EducationItem,
} from "../pages/types/cv.types";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
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
  const [step, setStep] = useState(1);

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

  function updateListItem(
    field: "skills" | "tools" | "languages",
    index: number,
    value: string
  ) {
    const updated = [...form[field]];
    updated[index] = value;
    updateField(field, updated);
  }

  function addListItem(field: "skills" | "tools" | "languages") {
    updateField(field, [...form[field], ""]);
  }

  function updateExperience(
    index: number,
    key: keyof ExperienceItem,
    value: string
  ) {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [key]: value };
    updateField("experience", updated);
  }

  function updateEducation(
    index: number,
    key: keyof EducationItem,
    value: string
  ) {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [key]: value };
    updateField("education", updated);
  }

  function validateStep(currentStep: number) {
    /* STEP 1 */
    if (currentStep === 1) {
      if (
        !form.name.trim() ||
        !form.title.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.location.trim() ||
        !form.summary.trim()
      ) {
        alert("Completá todos los datos personales");
        return false;
      }
    }

    /* STEP 2 */
    if (currentStep === 2) {
      const invalidExperience = form.experience.some(
        (exp) =>
          !exp.company.trim() ||
          !exp.position.trim() ||
          !exp.startDate.trim() ||
          !exp.endDate.trim() ||
          !exp.description.trim()
      );

      if (invalidExperience) {
        alert("Completá toda la experiencia laboral");
        return false;
      }
    }

    /* STEP 3 */
    if (currentStep === 3) {
      const invalidEducation = form.education.some(
        (edu) =>
          !edu.institution.trim() ||
          !edu.degree.trim() ||
          !edu.startDate.trim() ||
          !edu.endDate.trim()
      );

      if (invalidEducation) {
        alert("Completá toda la educación");
        return false;
      }
    }

    /* STEP 4 */
    if (currentStep === 4) {
      const invalidSkills = form.skills.some(
        (s) => !s.trim()
      );

      const invalidTools = form.tools.some(
        (t) => !t.trim()
      );

      const invalidLanguages = form.languages.some(
        (l) => !l.trim()
      );

      if (
        invalidSkills ||
        invalidTools ||
        invalidLanguages
      ) {
        alert(
          "Completá habilidades, herramientas e idiomas"
        );

        return false;
      }
    }

    return true;
  }

  function handleNext() {
    const valid = validateStep(step);

    if (!valid) return;

    setStep(step + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const valid = validateStep(4);

    if (!valid) return;

    onSubmit(form);
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium text-gray-300 mb-2";

  const sectionClass =
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl";

  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-4 py-10">

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb33,transparent_35%),radial-gradient(circle_at_bottom_left,#7c3aed33,transparent_35%)] -z-10" />

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto"
        autoComplete="on"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4">
            Crear CV con IA
          </h1>

          <p className="text-gray-400">
            Completá cada sección paso a paso
          </p>
        </div>

        {/* STEPS */}
        <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition ${
                step >= s
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold mb-8">
              Datos Personales
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  Nombre completo
                </label>

                <input
                  required
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Título profesional
                </label>

                <input
                  required
                  className={inputClass}
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Correo
                </label>

                <input
                  required
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelClass}>
                  Teléfono
                </label>

                <input
                  required
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Ubicación
                </label>

                <input
                  required
                  className={inputClass}
                  value={form.location}
                  onChange={(e) =>
                    updateField("location", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Resumen profesional
                </label>

                <textarea
                  required
                  rows={4}
                  className={inputClass}
                  value={form.summary}
                  onChange={(e) =>
                    updateField("summary", e.target.value)
                  }
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold mb-8">
              Experiencia Laboral
            </h2>

            {form.experience.map((exp, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5"
              >
                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    required
                    className={inputClass}
                    placeholder="Empresa"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Cargo"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(i, "position", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Desde"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(i, "startDate", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Hasta"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(i, "endDate", e.target.value)
                    }
                  />

                  <textarea
                    required
                    rows={3}
                    className={`${inputClass} md:col-span-2`}
                    placeholder="Descripción"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(i, "description", e.target.value)
                    }
                  />

                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                updateField("experience", [
                  ...form.experience,
                  { ...emptyExperience },
                ])
              }
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              + Agregar experiencia
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold mb-8">
              Educación
            </h2>

            {form.education.map((edu, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5"
              >
                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    required
                    className={inputClass}
                    placeholder="Institución"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Título"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Desde"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(i, "startDate", e.target.value)
                    }
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Hasta"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(i, "endDate", e.target.value)
                    }
                  />

                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                updateField("education", [
                  ...form.education,
                  { ...emptyEducation },
                ])
              }
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              + Agregar educación
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold mb-8">
              Habilidades y Herramientas
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Skills */}
              <div>
                <label className={labelClass}>
                  Habilidades
                </label>

                {form.skills.map((s, i) => (
                  <input
                    required
                    key={i}
                    className={`${inputClass} mb-3`}
                    placeholder="Ej: Liderazgo"
                    value={s}
                    onChange={(e) =>
                      updateListItem(
                        "skills",
                        i,
                        e.target.value
                      )
                    }
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addListItem("skills")}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Agregar
                </button>
              </div>

              {/* Tools */}
              <div>
                <label className={labelClass}>
                  Herramientas
                </label>

                {form.tools.map((t, i) => (
                  <input
                    required
                    key={i}
                    className={`${inputClass} mb-3`}
                    placeholder="Ej: React"
                    value={t}
                    onChange={(e) =>
                      updateListItem(
                        "tools",
                        i,
                        e.target.value
                      )
                    }
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addListItem("tools")}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Agregar
                </button>
              </div>

              {/* Languages */}
              <div>
                <label className={labelClass}>
                  Idiomas
                </label>

                {form.languages.map((l, i) => (
                  <input
                    required
                    key={i}
                    className={`${inputClass} mb-3`}
                    placeholder="Ej: Inglés"
                    value={l}
                    onChange={(e) =>
                      updateListItem(
                        "languages",
                        i,
                        e.target.value
                      )
                    }
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addListItem("languages")}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Agregar
                </button>
              </div>

            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-8">

          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl transition"
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Generando..." : "Generar CV"}
            </button>
          )}

        </div>
      </form>
    </div>
  );
}