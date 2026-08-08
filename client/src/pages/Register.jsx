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

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [agree, setAgree] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);

      alert("Registration Successful!");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
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
          title="Create Account"
          subtitle="Join CityOS AI and start reporting civic issues"
        >
          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Phone Number"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
            />

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />

              <span className="text-slate-200 text-sm">
                I agree to the Terms & Conditions
              </span>
            </div>

            <PrimaryButton type="submit" className="w-full">
              {loading ? "Creating Account..." : "Create Account"}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full mt-5 text-cyan-300 hover:text-cyan-200"
            >
              Already have an account? Sign In
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

export default Register;
