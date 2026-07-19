import LoadingPage from "@/pages/loading/LoadingPage";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isCheckingSession);

  if (isLoading) {
    return (
      <LoadingPage/>
    );
  }
  if (!isAuthenticated) {
    console.log("not authenticated")
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
