import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FilePlus2, ClipboardList, User, LogOut } from "lucide-react";

import HeroBanner from "../components/ui/HeroBanner";
import DashboardCard from "../components/ui/DashboardCard";
import StatsGrid from "../components/ui/StatsGrid";
import PrimaryButton from "../components/ui/PrimaryButton";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import PageContainer from "../components/ui/PageContainer";

function CitizenDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <PageContainer>
      <HeroBanner
        title={`Welcome, ${user?.name || "Citizen"} 👋`}
        subtitle="Report, Track and Resolve civic issues with CityOS AI."
      />

      {/* Quick Stats */}

      <StatsGrid>
        <DashboardCard>
          <h3 className="text-slate-300 text-sm font-semibold">
            Total Complaints
          </h3>

          <h1 className="text-5xl font-bold mt-4 text-blue-600">0</h1>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-slate-300 text-sm font-semibold">Pending</h3>

          <h1 className="text-5xl font-bold mt-4 text-yellow-500">0</h1>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-slate-300 text-sm font-semibold">Resolved</h3>

          <h1 className="text-5xl font-bold mt-4 text-green-600">0</h1>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-slate-300 text-sm font-semibold">In Progress</h3>

          <h1 className="text-5xl font-bold mt-4 text-cyan-600">0</h1>
        </DashboardCard>
      </StatsGrid>

      {/* Quick Actions */}

      <h2 className="text-3xl font-bold mb-6 text-white">Quick Actions</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -8 }}>
          <Link to="/report">
            <DashboardCard>
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <FilePlus2 size={34} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold mt-6 text-white">
                Report Complaint
              </h2>

              <p className="text-slate-300 mt-3">
                Report potholes, garbage, water leakage and other civic issues.
              </p>
            </DashboardCard>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -8 }}>
          <Link to="/my-complaints">
            <DashboardCard>
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <ClipboardList size={34} className="text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mt-6 text-white">
                My Complaints
              </h2>

              <p className="text-slate-300 mt-3">
                Track complaint status and view complete history.
              </p>
            </DashboardCard>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -8 }}>
          <DashboardCard>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <User size={34} className="text-purple-600" />
            </div>

            <h2 className="text-2xl font-bold mt-6 text-white">Profile</h2>

            <p className="mt-3 text-slate-300">{user?.email}</p>

            <p className="text-slate-300">{user?.phone}</p>

            <p className="capitalize mt-2 text-slate-300">{user?.role}</p>
          </DashboardCard>
        </motion.div>
      </div>

      {/* Logout */}

      <div className="mt-12 flex justify-end">
        <PrimaryButton
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-500 flex items-center gap-3"
        >
          <LogOut size={20} />
          Logout
        </PrimaryButton>
      </div>

      {/* Floating Report Button */}

      <FloatingActionButton icon="+" onClick={() => navigate("/report")} />
    </PageContainer>
  );
}

export default CitizenDashboard;
