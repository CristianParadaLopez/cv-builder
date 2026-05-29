// src/utils/validation.ts
// Funciones de validación y sanitización de inputs
// Seguridad: anti XSS, SQL injection, validación de caracteres

// ─── SANITIZACIÓN ──────────────────────────────────────────────────────────

/**
 * Sanitiza texto para prevenir XSS.
 * IMPORTANTE: Ya NO hace .trim() aquí para permitir escribir espacios entre palabras.
 * El trim() se aplica solo al enviar (sanitizeFormData).
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "")           // Remueve < y >
    .replace(/javascript:/gi, "")    // Remueve javascript:
    .replace(/on\w+=/gi, "")         // Remueve event handlers on*=
    .replace(/["'`]/g, "'");         // Normaliza comillas
}

/**
 * Valida que el input solo contenga caracteres permitidos
 */
export function validateCharacters(input: string, fieldName: string): string | null {
  if (!input) return null;
  const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.:,;()@+#/&%°'"]*$/;
  if (!validPattern.test(input)) {
    const invalidChars = input.split("").filter(c => !validPattern.test(c));
    return `El campo "${fieldName}" contiene caracteres no permitidos: ${[...new Set(invalidChars)].join(", ")}`;
  }
  return null;
}

export function validateLength(input: string, maxLength: number, fieldName: string): string | null {
  if (input && input.length > maxLength) {
    return `El campo "${fieldName}" excede el límite de ${maxLength} caracteres (${input.length} actual)`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return "El correo electrónico no es válido";
  return null;
}

export function validatePhone(phone: string): string | null {
  const phonePattern = /^[+]?[\d\s\-()]{8,20}$/;
  if (!phonePattern.test(phone)) return "El número de teléfono no es válido. Usa formato: +503 7000-0000";
  return null;
}

export function validateDate(date: string, type: "month" | "year"): string | null {
  if (type === "month") {
    const monthPattern = /^\d{4}-\d{2}$/;
    if (!monthPattern.test(date) && date !== "Presente") {
      return "Formato de fecha inválido. Usa: YYYY-MM (ej: 2023-06)";
    }
    if (date !== "Presente") {
      const [year, month] = date.split("-").map(Number);
      const currentYear = new Date().getFullYear();
      if (year < 1950 || year > currentYear + 5 || month < 1 || month > 12) {
        return "Fecha fuera de rango válido";
      }
    }
  } else {
    const yearPattern = /^\d{4}$/;
    if (!yearPattern.test(date)) return "Formato de año inválido. Usa: YYYY (ej: 2020)";
    const year = parseInt(date);
    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear + 10) return "Año fuera de rango válido";
  }
  return null;
}

// ─── LÍMITES ───────────────────────────────────────────────────────────────

export const LIMITS = {
  EXPERIENCE_MAX: 5,
  EDUCATION_MAX: 5,
  SKILLS_MAX: 10,
  TOOLS_MAX: 10,
  LANGUAGES_MAX: 5,
  CERTIFICATIONS_MAX: 5,
  VOLUNTEER_MAX: 5,
  PROJECTS_MAX: 5,

  NAME_MAX: 100,
  EMAIL_MAX: 100,
  PHONE_MAX: 30,
  LOCATION_MAX: 100,
  TITLE_MAX: 100,
  SUMMARY_MAX: 500,
  COMPANY_MAX: 100,
  POSITION_MAX: 100,
  DESCRIPTION_MAX: 1000,
  INSTITUTION_MAX: 100,
  DEGREE_MAX: 100,
  SKILL_MAX: 50,
  TOOL_MAX: 50,
  LANGUAGE_MAX: 30,
  CERT_NAME_MAX: 100,
  CERT_INSTITUTION_MAX: 100,
  PROJECT_TITLE_MAX: 100,
  PROJECT_DESC_MAX: 500,
} as const;

// ─── VALIDACIÓN COMPLETA DE FORMULARIO ─────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
  section?: string;
}

export function validateFormData(formData: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!formData.name?.trim()) {
    errors.push({ field: "name", message: "El nombre es requerido", section: "personal" });
  } else {
    const charError = validateCharacters(formData.name, "Nombre");
    if (charError) errors.push({ field: "name", message: charError, section: "personal" });
    const lenError = validateLength(formData.name, LIMITS.NAME_MAX, "Nombre");
    if (lenError) errors.push({ field: "name", message: lenError, section: "personal" });
  }

  if (!formData.email?.trim()) {
    errors.push({ field: "email", message: "El correo es requerido", section: "personal" });
  } else {
    const emailError = validateEmail(formData.email);
    if (emailError) errors.push({ field: "email", message: emailError, section: "personal" });
  }

  if (!formData.phone?.trim()) {
    errors.push({ field: "phone", message: "El teléfono es requerido", section: "personal" });
  } else {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.push({ field: "phone", message: phoneError, section: "personal" });
  }

  if (!formData.location?.trim()) {
    errors.push({ field: "location", message: "La ubicación es requerida", section: "personal" });
  }

  if (!formData.title?.trim()) {
    errors.push({ field: "title", message: "El título profesional es requerido", section: "personal" });
  }

  if (!formData.summary?.trim()) {
    errors.push({ field: "summary", message: "El resumen profesional es requerido", section: "personal" });
  } else {
    const lenError = validateLength(formData.summary, LIMITS.SUMMARY_MAX, "Resumen");
    if (lenError) errors.push({ field: "summary", message: lenError, section: "personal" });
  }

  if (formData.experience?.length > LIMITS.EXPERIENCE_MAX) {
    errors.push({ field: "experience", message: `Máximo ${LIMITS.EXPERIENCE_MAX} experiencias laborales`, section: "experience" });
  }

  formData.experience?.forEach((exp: any, i: number) => {
    if (!exp.company?.trim()) errors.push({ field: `experience[${i}].company`, message: `Experiencia #${i+1}: Empresa requerida`, section: "experience" });
    if (!exp.position?.trim()) errors.push({ field: `experience[${i}].position`, message: `Experiencia #${i+1}: Cargo requerido`, section: "experience" });
    if (!exp.startDate?.trim()) errors.push({ field: `experience[${i}].startDate`, message: `Experiencia #${i+1}: Fecha de inicio requerida`, section: "experience" });
    if (!exp.endDate?.trim()) errors.push({ field: `experience[${i}].endDate`, message: `Experiencia #${i+1}: Fecha de fin requerida`, section: "experience" });
    if (!exp.description?.trim()) errors.push({ field: `experience[${i}].description`, message: `Experiencia #${i+1}: Descripción requerida`, section: "experience" });
  });

  if (formData.education?.length > LIMITS.EDUCATION_MAX) {
    errors.push({ field: "education", message: `Máximo ${LIMITS.EDUCATION_MAX} educaciones`, section: "education" });
  }

  formData.education?.forEach((edu: any, i: number) => {
    if (!edu.institution?.trim()) errors.push({ field: `education[${i}].institution`, message: `Educación #${i+1}: Institución requerida`, section: "education" });
    if (!edu.degree?.trim()) errors.push({ field: `education[${i}].degree`, message: `Educación #${i+1}: Título requerido`, section: "education" });
    if (!edu.startDate?.trim()) errors.push({ field: `education[${i}].startDate`, message: `Educación #${i+1}: Año de inicio requerido`, section: "education" });
    if (!edu.endDate?.trim()) errors.push({ field: `education[${i}].endDate`, message: `Educación #${i+1}: Año de fin requerido`, section: "education" });
  });

  if (formData.skills?.length > LIMITS.SKILLS_MAX) {
    errors.push({ field: "skills", message: `Máximo ${LIMITS.SKILLS_MAX} habilidades`, section: "skills" });
  }
  if (formData.tools?.length > LIMITS.TOOLS_MAX) {
    errors.push({ field: "tools", message: `Máximo ${LIMITS.TOOLS_MAX} herramientas`, section: "tools" });
  }
  if (formData.languages?.length > LIMITS.LANGUAGES_MAX) {
    errors.push({ field: "languages", message: `Máximo ${LIMITS.LANGUAGES_MAX} idiomas`, section: "languages" });
  }

  return errors;
}

// ─── SANITIZACIÓN COMPLETA AL ENVIAR ───────────────────────────────────────

export function sanitizeFormData(formData: any): any {
  const sanitized = { ...formData };
  const clean = (s: string) => sanitizeInput(s).trim();

  if (sanitized.name) sanitized.name = clean(sanitized.name);
  if (sanitized.email) sanitized.email = clean(sanitized.email).toLowerCase();
  if (sanitized.phone) sanitized.phone = clean(sanitized.phone);
  if (sanitized.location) sanitized.location = clean(sanitized.location);
  if (sanitized.title) sanitized.title = clean(sanitized.title);
  if (sanitized.summary) sanitized.summary = clean(sanitized.summary);

  if (sanitized.experience) {
    sanitized.experience = sanitized.experience.map((exp: any) => ({
      ...exp,
      company: clean(exp.company),
      position: clean(exp.position),
      description: clean(exp.description),
    }));
  }

  if (sanitized.education) {
    sanitized.education = sanitized.education.map((edu: any) => ({
      ...edu,
      institution: clean(edu.institution),
      degree: clean(edu.degree),
      description: edu.description ? clean(edu.description) : undefined,
    }));
  }

  if (sanitized.skills) sanitized.skills = sanitized.skills.map((s: string) => clean(s));
  if (sanitized.tools) sanitized.tools = sanitized.tools.map((t: string) => clean(t));
  if (sanitized.languages) sanitized.languages = sanitized.languages.map((l: string) => clean(l));

  if (sanitized.certifications) {
    sanitized.certifications = sanitized.certifications.map((c: any) => ({
      ...c,
      name: clean(c.name),
      institution: clean(c.institution),
      description: c.description ? clean(c.description) : undefined,
      url: c.url ? clean(c.url) : undefined,
    }));
  }

  if (sanitized.volunteer) {
    sanitized.volunteer = sanitized.volunteer.map((v: any) => ({
      ...v,
      organization: clean(v.organization),
      role: clean(v.role),
      description: clean(v.description),
    }));
  }

  if (sanitized.projects) {
    sanitized.projects = sanitized.projects.map((p: any) => ({
      ...p,
      title: clean(p.title),
      description: clean(p.description),
      url: p.url ? clean(p.url) : undefined,
      tech: (p.tech || []).map((t: string) => clean(t)),
    }));
  }

  return sanitized;
}