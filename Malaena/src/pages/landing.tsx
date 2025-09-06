import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "../layout/Navbar";
import Hero from "../components/hero";
import About from "../components/about";

const LandingPage: React.FC = () => {
    return (
        <div className="bg-[#0D1B2A] min-h-[100vh]">
            <Nav  />
            <Routes>

                <Route path="/" element={<Hero />} />
                <Route path="about" element={<About />} />
            </Routes>
        </div>
    );
};

export default LandingPage;
