// data/instituciones-sv.ts
// Lista completa de instituciones de educación superior en El Salvador
// Fuente: MINED, CdA (Comisión de Acreditación), Wikipedia

export interface Institucion {
  id: string;
  nombre: string;
  tipo: "universidad" | "instituto_especializado" | "instituto_tecnologico" | "escuela";
  sector: "publico" | "privado";
  acreditada: boolean;
  sedes?: string[];
}

export const INSTITUCIONES_SV: Institucion[] = [
  // UNIVERSIDADES PÚBLICAS
  { id: "ues", nombre: "Universidad de El Salvador (UES)", tipo: "universidad", sector: "publico", acreditada: true, sedes: ["San Salvador", "San Miguel", "San Vicente", "Santa Ana"] },
  { id: "uped", nombre: "Universidad Pedagógica de El Salvador (UPED)", tipo: "universidad", sector: "publico", acreditada: true },

  // UNIVERSIDADES PRIVADAS ACREDITADAS
  { id: "uca", nombre: "Universidad Centroamericana José Simeón Cañas (UCA)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "udb", nombre: "Universidad Don Bosco (UDB)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "ufg", nombre: "Universidad Francisco Gavidia (UFG)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["San Salvador", "Santa Ana", "San Miguel", "La Unión", "Cojutepeque", "Chalatenango"] },
  { id: "utec", nombre: "Universidad Tecnológica de El Salvador (UTEC)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "ucat", nombre: "Universidad Católica de El Salvador (UNICAES)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["Santa Ana", "Ilobasco"] },
  { id: "udelgado", nombre: "Universidad Dr. José Matías Delgado (UJMD)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["San Salvador", "Santa Tecla", "San Miguel", "Santa Ana", "Zacatecoluca", "Chalatenango"] },
  { id: "uees", nombre: "Universidad Evangélica de El Salvador (UEES)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "ugb", nombre: "Universidad Gerardo Barrios (UGB)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["San Miguel", "Usulután"] },
  { id: "univo", nombre: "Universidad de Oriente (UNIVO)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "unab", nombre: "Universidad Dr. Andrés Bello (UNAB)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["San Salvador", "San Miguel", "Sonsonate", "Chalatenango"] },
  { id: "usam", nombre: "Universidad Salvadoreña Alberto Masferrer (USAM)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "unasa", nombre: "Universidad Autónoma de Santa Ana (UNASA)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "upan", nombre: "Universidad Panamericana de El Salvador (UPAN)", tipo: "universidad", sector: "privado", acreditada: true, sedes: ["San Salvador", "Ahuachapán", "San Vicente"] },

  // UNIVERSIDADES PRIVADAS (no acreditadas o en proceso)
  { id: "uae", nombre: "Universidad Albert Einstein (UAE)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "ucad", nombre: "Universidad Cristiana de las Asambleas de Dios (UCAD)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "uso", nombre: "Universidad de Sonsonate (USO)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "uls", nombre: "Universidad Luterana Salvadoreña (ULS)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "uma", nombre: "Universidad Modular Abierta (UMA)", tipo: "universidad", sector: "privado", acreditada: true },
  { id: "unoar", nombre: "Universidad Monseñor Óscar Arnulfo Romero (UNOAR)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "unssa", nombre: "Universidad Nueva San Salvador (UNSSA)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "upes", nombre: "Universidad Politécnica de El Salvador (UPES)", tipo: "universidad", sector: "privado", acreditada: false },
  { id: "utla", nombre: "Universidad Técnica Latinoamericana (UTLA)", tipo: "universidad", sector: "privado", acreditada: false },

  // INSTITUTOS ESPECIALIZADOS
  { id: "itca", nombre: "Escuela Especializada en Ingeniería ITCA-FEPADE", tipo: "instituto_especializado", sector: "publico", acreditada: true, sedes: ["Santa Tecla", "La Unión", "San Miguel", "Santa Ana", "Zacatecoluca"] },
  { id: "esen", nombre: "Escuela Superior de Economía y Negocios (ESEN)", tipo: "instituto_especializado", sector: "privado", acreditada: true },
  { id: "iesford", nombre: "Instituto Especializado de Nivel Superior para la Formación Diplomática (IESFORD)", tipo: "instituto_especializado", sector: "publico", acreditada: true },
  { id: "ieproes", nombre: "Instituto Especializado de Profesionales de la Salud (IEPROES)", tipo: "instituto_especializado", sector: "privado", acreditada: true },
  { id: "iesespiritu", nombre: "Instituto Especializado de Educación Superior El Espíritu Santo", tipo: "instituto_especializado", sector: "privado", acreditada: false },
  { id: "iseade", nombre: "Instituto Superior de Economía y Administración de Empresas (ISEADE)", tipo: "instituto_especializado", sector: "privado", acreditada: false },
  { id: "monica", nombre: "Escuela de Comunicación Mónica Herrera", tipo: "instituto_especializado", sector: "privado", acreditada: true },
  { id: "kriete", nombre: "Instituto Kriete de Ingeniería y Ciencias", tipo: "instituto_especializado", sector: "privado", acreditada: false },
  { id: "escmilitar", nombre: "Escuela Militar Capitán General Gerardo Barrios", tipo: "instituto_especializado", sector: "publico", acreditada: true },
  { id: "escagri", nombre: "Escuela Nacional de Agricultura Roberto Quiñónez", tipo: "instituto_especializado", sector: "publico", acreditada: true },
  { id: "esse", nombre: "Escuela Superior Franciscana Especializada (ESSE-AGAPE)", tipo: "instituto_especializado", sector: "publico", acreditada: true },
  { id: "ccsa", nombre: "Centro Cultural Salvadoreño Americano", tipo: "instituto_especializado", sector: "privado", acreditada: false },

  // INSTITUTOS TECNOLÓGICOS
  { id: "itcha", nombre: "Instituto Tecnológico de Chalatenango (ITCHA)", tipo: "instituto_tecnologico", sector: "publico", acreditada: true },
  { id: "itu", nombre: "Instituto Tecnológico de Usulután (ITU)", tipo: "instituto_tecnologico", sector: "publico", acreditada: false },
  { id: "itesc", nombre: "Instituto Tecnológico Escuela Técnica para la Salud", tipo: "instituto_tecnologico", sector: "privado", acreditada: false },
  { id: "itcentro", nombre: "Instituto Tecnológico Centroamericano", tipo: "instituto_tecnologico", sector: "publico", acreditada: true },
  { id: "itamerican", nombre: "Instituto Americano de Educación Superior", tipo: "instituto_tecnologico", sector: "privado", acreditada: false },
];

// Función helper para filtrar por tipo
export const getInstitucionesByTipo = (tipo: Institucion["tipo"]) => 
  INSTITUCIONES_SV.filter(i => i.tipo === tipo);

export const getInstitucionesBySector = (sector: Institucion["sector"]) => 
  INSTITUCIONES_SV.filter(i => i.sector === sector);

export const getInstitucionesAcreditadas = () => 
  INSTITUCIONES_SV.filter(i => i.acreditada);