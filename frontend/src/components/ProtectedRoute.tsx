import LoadingPage from "@/pages/loading/LoadingPage";
import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const ProtectedRoute = ({ fullWidth = false }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isCheckingSession);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (!isAuthenticated) {
    console.log("not authenticated");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-screen h-screen">
      {!fullWidth && <NavBar />}
      <main className={fullWidth ? "" : "md:w-3/4 w-11/12 mx-auto mt-14 pb-4"}>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
