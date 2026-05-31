import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingPage from "../pages/loading/LoadingPage";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      }
      setChecking(false);
    }

    // const verifyToken = async () => {
    //   // console.log("TOKEN: ", token);
    //   if (token) {
    //     try {
    //       await axios.get("http://localhost:8000/auth/v1/verify", {
    //         withCredentials: true,
    //       });
    //     } catch (error) {
    //       console.error("Token Verification Failed: ", error);
    //       localStorage.removeItem("authToken");
    //       navigate("/login", { replace: true });
    //     }
    //   } else {
    //     navigate("/login", { replace: true });
    //   }
    // };
    // verifyToken();
  }, [loading, user, navigate]);

  if (loading || checking) return <LoadingPage />;
  if (user) return <Outlet />;
};

export default ProtectedRoutes;
