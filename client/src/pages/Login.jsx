import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import MouseGlow from "../components/ui/MouseGlow";
import AuthLayout from "../components/ui/AuthLayout";
import AuthCard from "../components/ui/AuthCard";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import FloatingBlobs from "../components/ui/FloatingBlobs";
import BackgroundParticles from "../components/ui/BackgroundParticles";
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <MouseGlow />
      <BackgroundParticles />
      <FloatingBlobs />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full"
      >
        <AuthCard title="Citizen Login" subtitle="Access your CityOS account">
          <form onSubmit={handleLogin}>
            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-cyan-300 hover:text-cyan-200 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <PrimaryButton type="submit" className="w-full">
              {loading ? "Signing In..." : "Sign In"}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full mt-5 text-cyan-300 hover:text-cyan-200"
            >
              Create New Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full mt-3 text-slate-300 hover:text-white"
            >
              ← Back to Portal Selection
            </button>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}

export default Login;
