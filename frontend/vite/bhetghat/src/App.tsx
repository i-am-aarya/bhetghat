import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/page";
import GamePage from "./pages/game/GamePage";
import LandingPage from "./pages/landing/LandingPage";
import CharacterSelectionPage from "./pages/character/CharacterSelectionPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/game" element={<GamePage />} />
          <Route path="/character" element={<CharacterSelectionPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
