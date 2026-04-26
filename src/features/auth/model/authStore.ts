import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userEmail: string | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      isAuthenticated: false,

      login: (email: string) =>
        set({
          token: `fake-jwt-${Date.now()}`,
          userEmail: email,
          isAuthenticated: true,
        }),

      logout: () =>
        set({ token: null, userEmail: null, isAuthenticated: false }),
    }),
    {
      name: 'cinedash-auth', // salva no localStorage automaticamente
    }
  )
)
