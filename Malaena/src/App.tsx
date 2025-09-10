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
import Settings from './pages/setting';
import Hero from "./components/hero.tsx";
import About from "./components/about.tsx";
import ProfilePage from "./pages/profile";


function App() {
    return (
        <Router>
            <Routes>
                {/* Landing with nested routes */}
                <Route path="/" element={<Landing />}>
                    <Route index element={<Hero />} />
                    <Route path="about" element={<About />} />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dashboard with Layout */}
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
                    path="/profile"
                    element={
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    }
                />
                <Route
                    path="/setting"
                    element={
                        <Layout>
                            <Settings />
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

                {/* Profile standalone */}
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
