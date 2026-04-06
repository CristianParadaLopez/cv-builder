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
}

export interface PortfolioItem {
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
}

export type CVStyle = "moderno" | "clasico" | "minimalista" | "creativo";

export interface Template {
  id: CVStyle;
  name: string;
  description: string;
  colors: string[];
  preview: string;
}