import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isCheckingSession)

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  }

  if (isAuthenticated) {
    return <Navigate to="/character" replace />
  }

  return <Outlet/>
}
