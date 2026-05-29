// backend/src/types/cv.types.ts

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

export interface CertificationItem {
  name: string;
  institution: string;
  date: string;
  url?: string;
  expires?: string;
  description?: string;
}

export interface VolunteerItem {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

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
  certifications?: CertificationItem[];
  volunteer?: VolunteerItem[];
  projects?: ProjectItem[];
  photo?: string;
}

export interface CVGenerateRequest {
  formData: CVFormData;
  prompt?: string;
}

export interface CVEditRequest {
  currentHTML: string;
  prompt: string;
}