import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Limpa o estado antes de cada teste
    useAuthStore.setState({
      token: null,
      userEmail: null,
      isAuthenticated: false,
    })
  })

  it('deve fazer login e persistir dados', () => {
    const { login } = useAuthStore.getState()
    login('teste@email.com')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.userEmail).toBe('teste@email.com')
    expect(state.token).toBeDefined()
    expect(state.token).toContain('fake-jwt-')
  })

  it('deve fazer logout e limpar dados', () => {
    const store = useAuthStore.getState()
    store.login('teste@email.com')
    store.logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.userEmail).toBeNull()
    expect(state.token).toBeNull()
  })

  it('deve gerar token único a cada login', async () => {
    const store = useAuthStore.getState()
    store.login('a@a.com')
    const token1 = useAuthStore.getState().token

    store.logout()

    await new Promise((r) => setTimeout(r, 10))

    store.login('b@b.com')
    const token2 = useAuthStore.getState().token

    expect(token1).not.toBe(token2)
  })
})
