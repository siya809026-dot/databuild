import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Simulated backend with localStorage
function getStoredUsers(): Array<User & { password: string }> {
  const data = localStorage.getItem('app_users');
  return data ? JSON.parse(data) : [];
}

function storeUsers(users: Array<User & { password: string }>) {
  localStorage.setItem('app_users', JSON.stringify(users));
}

function generateToken(): string {
  return 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        
        const users = getStoredUsers();
        const user = users.find((u) => u.email === email && u.password === password);
        
        if (!user) {
          set({ isLoading: false, error: 'Invalid email or password' });
          return false;
        }
        
        const token = generateToken();
        const userData: User = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
        
        set({ user: userData, token, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        
        const users = getStoredUsers();
        if (users.find((u) => u.email === email)) {
          set({ isLoading: false, error: 'Email already registered' });
          return false;
        }
        
        const newUser = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        storeUsers(users);
        
        const token = generateToken();
        const userData: User = { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
        
        set({ user: userData, token, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
