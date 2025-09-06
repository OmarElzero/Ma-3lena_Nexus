import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
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
=======
import { Layout } from "./layout/Dashboard/layout";
import { Dashboard } from "./pages/dashboard";
import { Categories } from "./pages/Categories";
import { Courses } from "./pages/Courses";
import { Lesson } from "./pages/lesson";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { ChatbotPage } from "./pages/ChatbotPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/categories"
          element={
            <Layout>
              <Categories />
            </Layout>
          }
        />
        <Route
          path="/categories/:categoryId"
          element={
            <Layout>
              <Courses />
            </Layout>
          }
        />
        <Route path="/lesson/:courseId" element={<Lesson />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </Router>
>>>>>>> e985c840876101d4dcd6958bbbcf383c472a52ac
  );
}

export default App;
