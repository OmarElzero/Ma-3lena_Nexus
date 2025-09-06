import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") validateEmail(value);
    if (name === "password") validatePassword(value);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors(prev => ({ ...prev, email: regex.test(email) ? "" : "Invalid email format" }));
  };

  const validatePassword = (password: string) => {
    setErrors(prev => ({
      ...prev,
      password: password.length >= 6 ? "" : "Password must be at least 6 characters",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(formData.email);
    validatePassword(formData.password);

    if (!errors.email && !errors.password && formData.email && formData.password) {
      console.log("Form submitted:", formData);
      setFormData({ email: "", password: "" });
    } else {
      console.log("Please fix the errors before submitting");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <form
            onSubmit={handleSubmit}
            className="w-[80%] max-w-sm sm:w-[80] bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-lg"
        >

          <div className="flex mb-6 justify-center space-x-6 sm:space-x-8 border-b border-gray-700">
            <Link
                to="/signup"
                className={`pb-2 font-semibold text-sm sm:text-base transition ${
                    location.pathname === "/signup"
                        ? "text-cyan-300 border-b-2 border-cyan-300"
                        : "text-gray-400 hover:text-white"
                }`}
            >
              Sign Up
            </Link>
            <Link
                to="/login"
                className={`pb-2 font-semibold text-sm sm:text-base transition ${
                    location.pathname === "/login"
                        ? "text-cyan-300 border-b-2 border-cyan-300"
                        : "text-gray-400 hover:text-white"
                }`}
            >
              Log In
            </Link>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            Log In
          </h2>


          <div className="mb-4 relative">
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-700 text-white placeholder-gray-400 border ${
                    errors.email ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
                required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>


          <div className="mb-6 relative">
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-700 text-white placeholder-gray-400 border ${
                    errors.password ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
                required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
              type="submit"
              className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-cyan-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition transform"
          >
            Log In
          </button>

          <p className="mt-4 text-gray-400 text-xs sm:text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-cyan-300 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
  );
}
