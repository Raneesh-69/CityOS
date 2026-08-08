import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, Shield } from "lucide-react";
import { motion } from "framer-motion";

import GradientBackground from "../components/ui/GradientBackground";
import FloatingBlobs from "../components/ui/FloatingBlobs";
import LoginOptionCard from "../components/ui/LoginOptionCard";
import BackgroundParticles from "../components/ui/BackgroundParticles";
import MouseGlow from "../components/ui/MouseGlow";
function LoginSelection() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <MouseGlow />
      <BackgroundParticles />
      <FloatingBlobs />

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full">
          {/* Hero Section */}

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tight">
              CityOS AI
            </h1>

            <p className="text-2xl text-blue-100 mt-6">
              Smart Governance Platform for Modern Cities
            </p>

            <div className="mt-6 flex justify-center gap-4 text-slate-300 text-lg">
              <span>📍 Report</span>
              <span>•</span>
              <span>⚡ Manage</span>
              <span>•</span>
              <span>✅ Resolve</span>
            </div>
          </motion.div>

          {/* Cards */}

          <div className="grid lg:grid-cols-3 gap-10">
            <LoginOptionCard
              icon={<User size={40} color="white" />}
              title="Citizen"
              description="Report civic issues, upload photos and track complaint progress in real time."
              color="from-blue-600 to-cyan-500"
              onClick={() => navigate("/login")}
            />

            <LoginOptionCard
              icon={<ShieldCheck size={40} color="white" />}
              title="Officer"
              description="View assigned complaints, update progress and resolve issues efficiently."
              color="from-green-500 to-emerald-600"
              onClick={() => navigate("/officer/login")}
            />

            <LoginOptionCard
              icon={<Shield size={40} color="white" />}
              title="Administrator"
              description="Monitor city-wide operations, analytics, officers and system performance."
              color="from-purple-600 to-pink-500"
              onClick={() => navigate("/admin/login")}
            />
          </div>

          {/* Footer */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-20"
          >
            <h3 className="text-white text-xl font-semibold">
              Building Smarter Cities with AI
            </h3>

            <p className="text-slate-400 mt-2">CityOS AI • Version 1.0</p>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
}

export default LoginSelection;
