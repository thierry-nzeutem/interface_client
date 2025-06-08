import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    companies: Array<{
      id: string;
      name: string;
      siret: string;
    }>;
  } | null;
  login: (email: string, code: string) => Promise<void>;
  logout: () => void;
  requestCode: (email: string, method: 'email' | 'sms' | 'whatsapp') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Set to true for demo purposes
  user: {
    id: '1',
    email: 'demo@preveris.fr',
    name: 'Jean Dupont',
    companies: [
      { id: '1', name: 'Restaurant Le Gourmet', siret: '12345678901234' },
      { id: '2', name: 'Hôtel des Voyageurs', siret: '56789012345678' }
    ]
  },
  login: async (email: string, code: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ 
      isAuthenticated: true,
      user: {
        id: '1',
        email,
        name: 'Jean Dupont',
        companies: [
          { id: '1', name: 'Restaurant Le Gourmet', siret: '12345678901234' },
          { id: '2', name: 'Hôtel des Voyageurs', siret: '56789012345678' }
        ]
      }
    });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
  requestCode: async (email: string, method: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}));