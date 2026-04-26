import { useState, useEffect } from 'react'

// Evita chamadas desnecessárias à API enquanto o usuário digita.
// Só dispara depois que o usuário parar de digitar por `delay` ms.
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
