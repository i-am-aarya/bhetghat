import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import GamePage from "./pages/game/GamePage";
import CharacterSelectionPage from "./pages/character/CharacterSelectionPage";
import LandingPage from "./pages/landing/LandingPage";
import SignupPage from "./pages/signup/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import LobbyPage from "./pages/lobby/LobbyPage";
import GuestRoute from "./components/GuestRoute";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth)

  useEffect(() => {
      initAuth()
  }, [initAuth])

  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/lobby" element={<LobbyPage/>} />
          <Route path="/character" element={<CharacterSelectionPage />} />
          <Route path="/game" element={<GamePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
