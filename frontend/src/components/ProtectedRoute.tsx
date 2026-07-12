import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isCheckingSession);

  if (isLoading) {
    console.log("loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (!isAuthenticated) {
    console.log("not authenticated")
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
