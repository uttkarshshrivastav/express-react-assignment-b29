import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PuzzlePage from "./pages/PuzzlePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary-900">
          <Navbar />
          <main className="container mx-auto flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/puzzle"
                element={<ProtectedRoute element={<PuzzlePage />} />}
              />
              <Route
                path="/leaderboard"
                element={<LeaderboardPage />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<ProfilePage />} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
