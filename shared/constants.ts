// Service options for Angola
export const SERVICE_OPTIONS = [
  { value: "limpeza", label: "Limpeza Geral" },
  { value: "cozinha", label: "Cozinhar" },
  { value: "passadoria", label: "Passar Roupa" },
  { value: "jardinagem", label: "Jardinagem" },
  { value: "cuidado_criancas", label: "Cuidado de Crianças" },
  { value: "cuidado_idosos", label: "Cuidado de Idosos" },
  { value: "compras", label: "Fazer Compras" },
  { value: "organizacao", label: "Organização" },
  { value: "lavanderia", label: "Lavanderia" },
  { value: "baba", label: "Babá" },
  { value: "decoracao_eventos", label: "Decoração de Eventos" },
  { value: "taxista_automovel", label: "Taxista de Automóvel" },
  { value: "taxista_mota", label: "Taxista de Mota" },
  { value: "cobrador_taxi", label: "Cobrador de Táxi" },
  { value: "seguranca", label: "Segurança" },
  { value: "pintura", label: "Pintura" },
  { value: "carpintaria", label: "Carpintaria" },
  { value: "electricista", label: "Electricista" },
  { value: "canalizacao", label: "Canalização" },
  { value: "costura", label: "Costura" },
  { value: "cabeleireiro", label: "Cabeleireiro" },
  { value: "manicure", label: "Manicure" },
  { value: "massagista", label: "Massagista" },
  { value: "professor_particular", label: "Professor Particular" },
  { value: "animador_festas", label: "Animador de Festas" },
  { value: "fotografo", label: "Fotógrafo" },
  { value: "outros", label: "Outros" }
];

// Contract types
export const CONTRACT_TYPES = [
  { value: "tempo_inteiro", label: "Tempo Inteiro" },
  { value: "meio_periodo", label: "Meio Período" },
  { value: "por_horas", label: "Por Horas" },
  { value: "fins_semana", label: "Fins de Semana" },
  { value: "eventual", label: "Eventual" },
  { value: "freelance", label: "Freelance" }
];

// Service categories for better organization
export const SERVICE_CATEGORIES = {
  domesticos: {
    label: "Serviços Gerais",
    services: ["limpeza", "cozinha", "passadoria", "lavanderia", "organizacao"]
  },
  cuidados: {
    label: "Cuidados Pessoais",
    services: ["cuidado_criancas", "cuidado_idosos", "baba"]
  },
  transporte: {
    label: "Transporte",
    services: ["taxista_automovel", "taxista_mota", "cobrador_taxi"]
  },
  eventos: {
    label: "Eventos e Entretenimento",
    services: ["decoracao_eventos", "animador_festas", "fotografo"]
  },
  manutencao: {
    label: "Manutenção e Reparos",
    services: ["pintura", "carpintaria", "electricista", "canalizacao"]
  },
  beleza: {
    label: "Beleza e Bem-estar",
    services: ["cabeleireiro", "manicure", "massagista", "costura"]
  },
  educacao: {
    label: "Educação e Ensino",
    services: ["professor_particular"]
  },
  outros: {
    label: "Outros Serviços",
    services: ["seguranca", "compras", "jardinagem", "outros"]
  }
};