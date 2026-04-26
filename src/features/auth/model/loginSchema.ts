import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter mais de 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
