import { create } from 'zustand';

export interface Project {
  id: string;
  type: 'AT' | 'AUDIT' | 'CSSI' | 'RUS' | 'SUIVI' | 'AMO';
  title: string;
  company: string;
  establishment: string;
  status: 'EN_COURS' | 'VALIDE' | 'URGENT' | 'TERMINE';
  progress: number;
  lastActivity: string;
  nextDeadline?: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  filters: {
    type: string;
    status: string;
    company: string;
  };
  setFilters: (filters: Partial<ProjectState['filters']>) => void;
  setSelectedProject: (project: Project | null) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    type: 'AT',
    title: 'Autorisation travaux salle restaurant',
    company: 'Restaurant Le Gourmet',
    establishment: 'Paris 15ème',
    status: 'EN_COURS',
    progress: 65,
    lastActivity: 'Documents complétés',
    nextDeadline: '2024-02-15',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    type: 'AUDIT',
    title: 'Audit sécurité incendie',
    company: 'Hôtel des Voyageurs',
    establishment: 'Lyon Centre',
    status: 'VALIDE',
    progress: 100,
    lastActivity: 'Rapport validé',
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    type: 'CSSI',
    title: 'Coordination SSI rénovation',
    company: 'Restaurant Le Gourmet',
    establishment: 'Paris 15ème',
    status: 'URGENT',
    progress: 30,
    lastActivity: 'En attente documents',
    nextDeadline: '2024-01-25',
    createdAt: '2024-01-12'
  }
];

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,
  selectedProject: null,
  filters: {
    type: '',
    status: '',
    company: ''
  },
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  setSelectedProject: (project) => set({ selectedProject: project })
}));