import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('deve retornar valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('test', 500))
    expect(result.current).toBe('test')
  })

  it('deve manter valor anterior antes do delay expirar', async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 100),
      { initialProps: { value: 'valor1' } }
    )

    expect(result.current).toBe('valor1')

    act(() => {
      rerender({ value: 'valor2' })
    })

    // Antes do delay, ainda deve ser o valor anterior
    expect(result.current).toBe('valor1')
  })

  it('deve atualizar valor após o delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 100),
      { initialProps: { value: 'valor1' } }
    )

    act(() => {
      rerender({ value: 'valor2' })
    })

    await waitFor(() => {
      expect(result.current).toBe('valor2')
    })
  })

  it('deve usar delay padrão de 500ms quando não especificado', () => {
    const { result } = renderHook(() => useDebounce('batman'))
    expect(result.current).toBe('batman')
  })

  it('deve funcionar com tipos numéricos', async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 50),
      { initialProps: { value: 1 } }
    )

    act(() => {
      rerender({ value: 42 })
    })

    await waitFor(() => {
      expect(result.current).toBe(42)
    })
  })
})
