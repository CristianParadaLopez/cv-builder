// data/profesiones.ts
// Lista jerárquica de profesiones y cargos para campos dependientes

export interface CategoriaProfesion {
  id: string;
  nombre: string;
  icono: string;
  cargos: string[];
  skillsSugeridas: string[];
  herramientasSugeridas: string[];
}

export const CATEGORIAS_PROFESIONALES: CategoriaProfesion[] = [
  {
    id: "tecnologia",
    nombre: "Tecnología y Desarrollo",
    icono: "💻",
    cargos: [
      "Desarrollador Frontend",
      "Desarrollador Backend",
      "Desarrollador Full Stack",
      "Ingeniero de Software",
      "DevOps Engineer",
      "Data Scientist",
      "Analista de Datos",
      "Ciberseguridad",
      "Administrador de Sistemas",
      "Soporte Técnico",
      "QA Engineer",
      "UX/UI Designer",
      "Product Manager",
      "Scrum Master",
      "Arquitecto de Software",
      "Ingeniero de Redes",
      "Especialista en Cloud",
      "Machine Learning Engineer",
    ],
    skillsSugeridas: [
      "Resolución de problemas",
      "Pensamiento lógico",
      "Trabajo en equipo",
      "Comunicación técnica",
      "Aprendizaje continuo",
      "Gestión del tiempo",
      "Atención al detalle",
    ],
    herramientasSugeridas: [
      "JavaScript", "TypeScript", "Python", "Java", "React", "Node.js",
      "Git", "Docker", "AWS", "SQL", "MongoDB", "Figma", "VS Code",
      "Linux", "Kubernetes", "Terraform", "Jira", "Postman",
    ],
  },
  {
    id: "diseño",
    nombre: "Diseño y Creatividad",
    icono: "🎨",
    cargos: [
      "Diseñador Gráfico",
      "Diseñador UX/UI",
      "Diseñador de Producto",
      "Ilustrador",
      "Motion Designer",
      "Diseñador Web",
      "Brand Designer",
      "Art Director",
      "Diseñador Editorial",
      "Fotógrafo Profesional",
      "Videógrafo",
      "Animador 3D",
      "Diseñador de Packaging",
      "Diseñador de Moda",
    ],
    skillsSugeridas: [
      "Creatividad",
      "Comunicación visual",
      "Manejo del color",
      "Tipografía",
      "Pensamiento crítico",
      "Gestión de proyectos",
      "Presentación de ideas",
    ],
    herramientasSugeridas: [
      "Adobe Photoshop", "Adobe Illustrator", "Figma", "Adobe XD",
      "Sketch", "InDesign", "After Effects", "Premiere Pro",
      "Blender", "Cinema 4D", "Canva", "Procreate",
    ],
  },
  {
    id: "negocios",
    nombre: "Negocios y Administración",
    icono: "📊",
    cargos: [
      "Administrador de Empresas",
      "Gerente de Proyectos",
      "Analista de Negocios",
      "Consultor",
      "Director de Operaciones",
      "Gerente de Ventas",
      "Especialista en Marketing",
      "Community Manager",
      "Especialista en SEO/SEM",
      "Analista Financiero",
      "Contador",
      "Auditor",
      "Recursos Humanos",
      "Asistente Administrativo",
      "Recepcionista",
      "Secretaria Ejecutiva",
    ],
    skillsSugeridas: [
      "Liderazgo",
      "Toma de decisiones",
      "Negociación",
      "Planificación estratégica",
      "Análisis financiero",
      "Comunicación interpersonal",
      "Gestión de conflictos",
    ],
    herramientasSugeridas: [
      "Excel", "PowerPoint", "SAP", "Salesforce", "HubSpot",
      "Google Analytics", "Meta Business Suite", "QuickBooks",
      "Microsoft Office", "Google Workspace", "Slack", "Trello",
    ],
  },
  {
    id: "salud",
    nombre: "Salud y Medicina",
    icono: "🏥",
    cargos: [
      "Médico General",
      "Enfermero/a",
      "Farmacéutico",
      "Fisioterapeuta",
      "Nutricionista",
      "Psicólogo",
      "Odontólogo",
      "Veterinario",
      "Técnico de Laboratorio",
      "Radiólogo",
      "Terapeuta Ocupacional",
      "Optometrista",
      "Paramédico",
      "Cuidador de Adultos Mayores",
      "Asistente Dental",
    ],
    skillsSugeridas: [
      "Empatía",
      "Comunicación con pacientes",
      "Trabajo bajo presión",
      "Ética profesional",
      "Atención al detalle",
      "Trabajo en equipo multidisciplinario",
      "Manejo de crisis",
    ],
    herramientasSugeridas: [
      "Historia Clínica Electrónica", "DICOM", "Office", "Epic",
      "Meditech", "Excel", "SPSS", "R",
    ],
  },
  {
    id: "educacion",
    nombre: "Educación y Enseñanza",
    icono: "📚",
    cargos: [
      "Profesor de Primaria",
      "Profesor de Secundaria",
      "Docente Universitario",
      "Instructor Técnico",
      "Pedagogo",
      "Orientador Vocacional",
      "Coordinador Académico",
      "Director de Escuela",
      "Tutor Online",
      "Especialista en Educación Especial",
      "Bibliotecario",
      "Investigador Educativo",
    ],
    skillsSugeridas: [
      "Paciencia",
      "Comunicación efectiva",
      "Adaptabilidad",
      "Creatividad pedagógica",
      "Manejo de grupo",
      "Evaluación formativa",
      "Tecnología educativa",
    ],
    herramientasSugeridas: [
      "Google Classroom", "Moodle", "Zoom", "Microsoft Teams",
      "Kahoot", "Genially", "Canva Edu", "Office",
    ],
  },
  {
    id: "ingenieria",
    nombre: "Ingeniería y Construcción",
    icono: "🏗️",
    cargos: [
      "Ingeniero Civil",
      "Ingeniero Industrial",
      "Ingeniero Mecánico",
      "Ingeniero Eléctrico",
      "Ingeniero Químico",
      "Arquitecto",
      "Diseñador de Interiores",
      "Topógrafo",
      "Supervisor de Obra",
      "Capataz de Construcción",
      "Albañil",
      "Electricista",
      "Plomero",
      "Soldador",
      "Técnico en Refrigeración",
      "Mecánico Automotriz",
      "Operador de Maquinaria",
    ],
    skillsSugeridas: [
      "Resolución de problemas técnicos",
      "Lectura de planos",
      "Seguridad industrial",
      "Gestión de proyectos",
      "Trabajo en altura",
      "Precisión",
      "Trabajo en equipo",
    ],
    herramientasSugeridas: [
      "AutoCAD", "Revit", "SketchUp", "ArcGIS", "MATLAB",
      "SolidWorks", "Project", "Excel", "Herramientas manuales",
      "Equipo de seguridad", "GPS", "Nivel láser",
    ],
  },
  {
    id: "turismo",
    nombre: "Turismo y Hospitalidad",
    icono: "✈️",
    cargos: [
      "Gerente de Hotel",
      "Recepcionista de Hotel",
      "Chef",
      "Mesero/a",
      "Bartender",
      "Guía Turístico",
      "Agente de Viajes",
      "Coordinador de Eventos",
      "Housekeeping",
      "Concierge",
      "Animador Turístico",
      "Barista",
      "Panadero",
      "Repostero",
      "Cocinero",
    ],
    skillsSugeridas: [
      "Atención al cliente",
      "Multitasking",
      "Trabajo bajo presión",
      "Idiomas",
      "Cultura de servicio",
      "Resolución de conflictos",
      "Trabajo en turnos",
    ],
    herramientasSugeridas: [
      "Opera PMS", "Sabre", "Amadeus", "Excel", "POS",
      "Herramientas de cocina", "Sistemas de reservas",
    ],
  },
  {
    id: "legal",
    nombre: "Derecho y Legal",
    icono: "⚖️",
    cargos: [
      "Abogado",
      "Notario",
      "Procurador",
      "Asistente Legal",
      "Paralegal",
      "Juez",
      "Fiscal",
      "Defensor Público",
      "Investigador Legal",
      "Consultor en Cumplimiento",
      "Especialista en Propiedad Intelectual",
    ],
    skillsSugeridas: [
      "Análisis jurídico",
      "Redacción legal",
      "Negociación",
      "Ética profesional",
      "Investigación",
      "Argumentación",
      "Manejo de conflictos",
    ],
    herramientasSugeridas: [
      "Westlaw", "LexisNexis", "Office", "Sistemas de gestión de casos",
      "Base de datos jurídicas", "Zoom",
    ],
  },
  {
    id: "ventas",
    nombre: "Ventas y Atención al Cliente",
    icono: "🛒",
    cargos: [
      "Vendedor",
      "Ejecutivo de Ventas",
      "Representante de Ventas",
      "Asesor Comercial",
      "Promotor",
      "Cajero",
      "Atención al Cliente",
      "Soporte Técnico Comercial",
      "Key Account Manager",
      "Gerente de Cuentas",
      "Vendedor Online",
      "Afiliado/Dropshipper",
    ],
    skillsSugeridas: [
      "Comunicación persuasiva",
      "Cierre de ventas",
      "Manejo de objeciones",
      "Empatía",
      "Resiliencia",
      "Conocimiento de producto",
      "Negociación",
    ],
    herramientasSugeridas: [
      "CRM", "Excel", "Meta Ads", "Google Ads", "Shopify",
      "Mercado Libre", "Amazon Seller", "WhatsApp Business",
    ],
  },
  {
    id: "otros",
    nombre: "Otros Servicios",
    icono: "🔧",
    cargos: [
      "Conductor",
      "Mensajero/Delivery",
      "Seguridad Privada",
      "Jardinero",
      "Limpieza",
      "Niñera/Cuidador",
      "Estilista/Peluquero",
      "Manicurista",
      "Maquillista",
      "Tatuador",
      "Mecánico",
      "Reparador de Electrodomésticos",
      "Costurera",
      "Zapatero",
      "Carpintero",
      "Herrero",
      "Pintor",
      "Taxista",
      "Mototaxista",
      "Vigilante",
    ],
    skillsSugeridas: [
      "Puntualidad",
      "Responsabilidad",
      "Honestidad",
      "Trabajo duro",
      "Atención al detalle",
      "Servicio al cliente",
      "Iniciativa",
    ],
    herramientasSugeridas: [
      "Herramientas especializadas", "Vehículo propio", "Celular",
      "WhatsApp Business", "GPS", "Equipo de protección",
    ],
  },
];

// Helper para obtener cargos por categoría
export const getCargosByCategoria = (categoriaId: string): string[] => {
  const cat = CATEGORIAS_PROFESIONALES.find(c => c.id === categoriaId);
  return cat?.cargos || [];
};

export const getAllCargos = (): string[] => {
  return CATEGORIAS_PROFESIONALES.flatMap(c => c.cargos);
};

export const getSkillsByCategoria = (categoriaId: string): string[] => {
  const cat = CATEGORIAS_PROFESIONALES.find(c => c.id === categoriaId);
  return cat?.skillsSugeridas || [];
};

export const getToolsByCategoria = (categoriaId: string): string[] => {
  const cat = CATEGORIAS_PROFESIONALES.find(c => c.id === categoriaId);
  return cat?.herramientasSugeridas || [];
};

// Buscar categoría por cargo
export const findCategoriaByCargo = (cargo: string): CategoriaProfesion | undefined => {
  return CATEGORIAS_PROFESIONALES.find(c => 
    c.cargos.some(cg => cg.toLowerCase().includes(cargo.toLowerCase()) || 
    cargo.toLowerCase().includes(cg.toLowerCase()))
  );
};