// GerustThuis Projectplan Data
// Fasen, acties, planning en budget

export const fasen = [
  {
    id: 1,
    naam: 'Fase 1: Fundament',
    beschrijving: 'Technische infrastructuur en basis functionaliteit',
    status: 'actief',
    startDatum: '2026-01-01',
    eindDatum: '2026-03-31',
    voortgang: 75
  },
  {
    id: 2,
    naam: 'Fase 2: Gebruikerservaring',
    beschrijving: 'Dashboard, patronen en analyse views',
    status: 'actief',
    startDatum: '2026-02-01',
    eindDatum: '2026-04-30',
    voortgang: 40
  },
  {
    id: 3,
    naam: 'Fase 3: Intelligentie',
    beschrijving: 'Machine learning en voorspellende analyses',
    status: 'gepland',
    startDatum: '2026-04-01',
    eindDatum: '2026-06-30',
    voortgang: 0
  },
  {
    id: 4,
    naam: 'Fase 4: Integraties',
    beschrijving: 'Externe systemen en notificaties',
    status: 'gepland',
    startDatum: '2026-05-01',
    eindDatum: '2026-07-31',
    voortgang: 0
  },
  {
    id: 5,
    naam: 'Fase 5: Schaalbaarheid',
    beschrijving: 'Multi-tenant en enterprise features',
    status: 'gepland',
    startDatum: '2026-07-01',
    eindDatum: '2026-09-30',
    voortgang: 0
  }
]

export const acties = [
  // Fase 1
  {
    id: 1,
    faseId: 1,
    titel: 'Supabase database setup',
    beschrijving: 'PostgreSQL schema met RLS policies',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Tech Lead'
  },
  {
    id: 2,
    faseId: 1,
    titel: 'Hue Bridge integratie',
    beschrijving: 'SSE connectie voor real-time sensor events',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Backend Dev'
  },
  {
    id: 3,
    faseId: 1,
    titel: 'Vue 3 portaal opzet',
    beschrijving: 'Frontend applicatie met Vite',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Frontend Dev'
  },
  {
    id: 4,
    faseId: 1,
    titel: 'Sensor health monitoring',
    beschrijving: 'Battery tracking en liveness detectie',
    status: 'actief',
    prioriteit: 'medium',
    verantwoordelijke: 'Backend Dev'
  },
  {
    id: 5,
    faseId: 1,
    titel: 'RLS security audit',
    beschrijving: 'Row Level Security policies valideren',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Security'
  },
  // Fase 2
  {
    id: 6,
    faseId: 2,
    titel: 'Dashboard view',
    beschrijving: 'Real-time overzicht van activiteit',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Frontend Dev'
  },
  {
    id: 7,
    faseId: 2,
    titel: 'Patronen view',
    beschrijving: 'Dagelijkse activiteitspatronen visualisatie',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Frontend Dev'
  },
  {
    id: 8,
    faseId: 2,
    titel: 'Analyse view',
    beschrijving: 'Baseline vergelijking en afwijkingen',
    status: 'actief',
    prioriteit: 'medium',
    verantwoordelijke: 'Frontend Dev'
  },
  {
    id: 9,
    faseId: 2,
    titel: 'Consistentie fixes',
    beschrijving: 'Uniforme berekeningen over alle views',
    status: 'voltooid',
    prioriteit: 'hoog',
    verantwoordelijke: 'Frontend Dev'
  },
  // Fase 3
  {
    id: 10,
    faseId: 3,
    titel: 'Baseline learning algoritme',
    beschrijving: 'Automatisch leren van normale patronen',
    status: 'gepland',
    prioriteit: 'hoog',
    verantwoordelijke: 'ML Engineer'
  },
  {
    id: 11,
    faseId: 3,
    titel: 'Anomalie detectie',
    beschrijving: 'Afwijkingen van normale patronen signaleren',
    status: 'gepland',
    prioriteit: 'hoog',
    verantwoordelijke: 'ML Engineer'
  },
  // Fase 4
  {
    id: 12,
    faseId: 4,
    titel: 'Push notificaties',
    beschrijving: 'Alerts naar mantelzorgers',
    status: 'gepland',
    prioriteit: 'hoog',
    verantwoordelijke: 'Backend Dev'
  },
  {
    id: 13,
    faseId: 4,
    titel: 'Email integratie',
    beschrijving: 'Dagelijkse/wekelijkse rapportages',
    status: 'gepland',
    prioriteit: 'medium',
    verantwoordelijke: 'Backend Dev'
  },
  // Fase 5
  {
    id: 14,
    faseId: 5,
    titel: 'Multi-tenant architectuur',
    beschrijving: 'Meerdere organisaties ondersteunen',
    status: 'gepland',
    prioriteit: 'medium',
    verantwoordelijke: 'Architect'
  },
  {
    id: 15,
    faseId: 5,
    titel: 'Admin dashboard',
    beschrijving: 'Beheer interface voor organisaties',
    status: 'gepland',
    prioriteit: 'medium',
    verantwoordelijke: 'Frontend Dev'
  }
]

export const budget = {
  totaal: 50000,
  uitgegeven: 18500,
  categorieen: [
    {
      naam: 'Development',
      budget: 30000,
      uitgegeven: 12000,
      items: [
        { naam: 'Frontend ontwikkeling', bedrag: 6000 },
        { naam: 'Backend ontwikkeling', bedrag: 4000 },
        { naam: 'Database setup', bedrag: 2000 }
      ]
    },
    {
      naam: 'Infrastructuur',
      budget: 10000,
      uitgegeven: 3500,
      items: [
        { naam: 'Supabase hosting', bedrag: 2000 },
        { naam: 'Vercel hosting', bedrag: 500 },
        { naam: 'Domein en SSL', bedrag: 500 },
        { naam: 'Monitoring tools', bedrag: 500 }
      ]
    },
    {
      naam: 'Hardware',
      budget: 5000,
      uitgegeven: 2000,
      items: [
        { naam: 'Hue Bridge test units', bedrag: 500 },
        { naam: 'Motion sensors', bedrag: 1000 },
        { naam: 'Contact sensors', bedrag: 500 }
      ]
    },
    {
      naam: 'Overig',
      budget: 5000,
      uitgegeven: 1000,
      items: [
        { naam: 'Documentatie', bedrag: 500 },
        { naam: 'Training', bedrag: 500 }
      ]
    }
  ]
}

export const planning = [
  { maand: 'Jan 2026', fasen: [1], milestones: ['Database schema', 'Hue integratie'] },
  { maand: 'Feb 2026', fasen: [1, 2], milestones: ['Dashboard MVP', 'Sensor health'] },
  { maand: 'Mrt 2026', fasen: [1, 2], milestones: ['Patronen view', 'Security audit'] },
  { maand: 'Apr 2026', fasen: [2, 3], milestones: ['Analyse view', 'Baseline learning'] },
  { maand: 'Mei 2026', fasen: [3, 4], milestones: ['Anomalie detectie', 'Push notificaties'] },
  { maand: 'Jun 2026', fasen: [3, 4], milestones: ['ML fine-tuning', 'Email rapportages'] },
  { maand: 'Jul 2026', fasen: [4, 5], milestones: ['Integratie tests', 'Multi-tenant basis'] },
  { maand: 'Aug 2026', fasen: [5], milestones: ['Admin dashboard', 'Documentatie'] },
  { maand: 'Sep 2026', fasen: [5], milestones: ['Beta release', 'Gebruikerstests'] }
]
