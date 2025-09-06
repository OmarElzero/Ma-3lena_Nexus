import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import Hero from "./components/hero.tsx";
import About from "./components/about.tsx";
function App() {
  return (
      <Router>
          <Routes>

              <Route path="/" element={<LandingPage />}>
                  <Route element={<Hero />} />
                  <Route path="about" element={<About />} />
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
          </Routes>
      </Router>
  );
}

export default App;
