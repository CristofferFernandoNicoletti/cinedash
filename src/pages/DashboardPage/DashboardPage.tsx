import { useAuthStore } from '@/features/auth/model/authStore'

export function DashboardPage() {
  const { userEmail, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">🎬 CineDash</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userEmail}</span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Sair
          </button>
        </div>
      </div>
      <p>Dashboard em construção... ✅ Login funcionando!</p>
    </div>
  )
}
