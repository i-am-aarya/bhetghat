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
import RoomPage from "./pages/room/RoomPage";
import { Toaster } from "./components/ui/sonner";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import SettingsPage from "./pages/settings/SettingsPage";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/*<Route*/}
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/character" element={<CharacterSelectionPage />} />
          <Route path="/room/:code" element={<RoomPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<ProtectedRoute fullWidth={true} />}>
          <Route path="/room/:code/play" element={<GamePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
