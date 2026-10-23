import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import BandPage from "./pages/BandPage";
import BlackBookPage from "./pages/BlackBookPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import ResolveBandPage from "./pages/ResolveBandPage";
import SearchPage from "./pages/SearchPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="buscar" element={<SearchPage />} />
              <Route path="b/:name" element={<ResolveBandPage />} />
              <Route path="banda/:mbid" element={<BandPage />} />
              <Route path="banda/:mbid/membro/:memberId" element={<BandPage />} />
              <Route path="livro-negro" element={<BlackBookPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="entrar" element={<LoginPage />} />
              <Route path="cadastro" element={<SignupPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}
