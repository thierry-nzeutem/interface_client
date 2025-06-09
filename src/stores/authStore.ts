import { create } from 'zustand';

// Helpers for persistence
const loadUser = () => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistUser = (user: AuthState['user'] | null) => {
  if (typeof localStorage === 'undefined') return;
  if (user) {
    localStorage.setItem('authUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('authUser');
  }
};

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

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = loadUser();

  return {
    isAuthenticated: !!storedUser,
    user: storedUser,

    login: async (email: string, code: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userData = {
        id: '1',
        email,
        name: 'Jean Dupont',
        companies: [
          { id: '1', name: 'Restaurant Le Gourmet', siret: '12345678901234' },
          { id: '2', name: 'Hôtel des Voyageurs', siret: '56789012345678' }
        ]
      };

      persistUser(userData);
      set({ isAuthenticated: true, user: userData });
    },

    logout: () => {
      persistUser(null);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('quoteRequestDrafts');
        localStorage.removeItem('quoteRequestCurrentStep');
      }
      set({ isAuthenticated: false, user: null });
    },

    requestCode: async (email: string, method: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };
});
