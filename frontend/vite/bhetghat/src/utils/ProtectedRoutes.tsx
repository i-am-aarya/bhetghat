import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingPage from "../pages/loading/LoadingPage";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      console.log("TOKEN: ", token);
      if (token) {
        try {
          await axios.get("http://localhost:8000/auth/v1/verify", {
            withCredentials: true,
          });
          setLoading(false);
        } catch (error) {
          console.error("Token Verification Failed: ", error);
          localStorage.removeItem("authToken");
          navigate("/login", { replace: true });
          setLoading(false);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    verifyToken();
  }, [token, navigate]);

  // return loading ? <Outlet /> : <LoadingPage />;
  return loading ? <LoadingPage /> : <Outlet />;
};

export default ProtectedRoutes;
