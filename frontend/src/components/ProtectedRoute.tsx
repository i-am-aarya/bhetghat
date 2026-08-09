import LoadingPage from "@/pages/loading/LoadingPage";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

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

  // return <Outlet />;
  return <div className="w-screen h-screen">
    <NavBar/>
    <main className="w-3/4 mx-auto mt-14">
    <Outlet/>
    </main >
  </div>
};

export default ProtectedRoute;
