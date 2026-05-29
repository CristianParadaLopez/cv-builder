// frontend/src/types/cv.types.ts

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  url?: string;
  tech: string[];
}

// NUEVO: Certificaciones
export interface CertificationItem {
  name: string;
  institution: string;
  date: string;
  url?: string;
  expires?: string;
  description?: string;
}

// NUEVO: Voluntariados / Horas sociales
export interface VolunteerItem {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

// NUEVO: Proyectos
export interface ProjectItem {
  title: string;
  description: string;
  url?: string;
  tech: string[];
}

export interface CVFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  tools: string[];
  languages: string[];
  portfolio?: PortfolioItem[];
  // NUEVOS campos opcionales
  certifications?: CertificationItem[];
  volunteer?: VolunteerItem[];
  projects?: ProjectItem[];
  photo?: string; // Base64 de la foto de perfil
}

export type CVStyle = "moderno" | "clasico" | "minimalista" | "creativo";

export type CVMode = "ats" | "designed";

export interface Template {
  id: CVStyle;
  name: string;
  description: string;
  colors: string[];
  preview?: string;
  gradient?: string;
}

// NUEVO: Info de plataforma para recomendacion
export interface PlatformRecommendation {
  platform: string;
  mode: CVMode;
  reason: string;
}