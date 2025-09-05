import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  );
}

export default App;
