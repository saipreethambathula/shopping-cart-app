import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      alert(
        "Username must be 3-20 characters long and can include letters, numbers, and underscores only.",
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const url = isLogin ? "/users/login" : "/users";
      const res = await fetch(`${baseURL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-4xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {/* Toggle Login / Signup */}
        <div className="flex mb-10 bg-neutral-50 p-1.5 rounded-2xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              isLogin
                ? "bg-white shadow-sm text-black"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              !isLogin
                ? "bg-white shadow-sm text-black"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? "Welcome Back" : "Join Us"}
          </h1>
          <p className="text-neutral-400 text-sm">
            {isLogin
              ? "Enter your credentials to continue"
              : "Create an account to start shopping"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all text-sm"
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all text-sm pr-12"
              placeholder="••••••••"
              required
            />
            <span
              className="absolute right-4 top-9.5 cursor-pointer text-neutral-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-50 mt-6 shadow-xl shadow-black/10"
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
