import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../services/api";

import AuthLayout from "../components/ui/AuthLayout";
import AuthCard from "../components/ui/AuthCard";
import InputField from "../components/ui/InputField";
import PrimaryButton from "../components/ui/PrimaryButton";
import FloatingBlobs from "../components/ui/FloatingBlobs";
import BackgroundParticles from "../components/ui/BackgroundParticles";
import MouseGlow from "../components/ui/MouseGlow";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      if (data.user.role !== "admin") {
        alert("Access denied. Admin account required.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full"
      >
        <AuthCard
          title="Administrator Login"
          subtitle="Access the CityOS AI Control Center"
        >
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
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
                className="text-cyan-300 hover:text-cyan-200"
              >
                Forgot Password?
              </button>
            </div>

            <PrimaryButton
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
            >
              {loading ? "Signing In..." : "Admin Login"}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full mt-5 text-slate-300 hover:text-white"
            >
              ← Back to Portal Selection
            </button>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}

export default AdminLogin;
