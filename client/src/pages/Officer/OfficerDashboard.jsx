import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";
import OfficerActions from "../../components/OfficerActions";
import { getAssignedComplaints } from "../../services/officerService";

function OfficerDashboard() {
  const navigate = useNavigate();

  // Safely retrieve user from localStorage
  const user = useMemo(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  }, []);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const officerLinks = [
    { label: "Dashboard", path: "/officer", icon: "🏠" },
    { label: "Assigned", path: "/officer/assigned", icon: "📋" },
    { label: "Profile", path: "/officer/profile", icon: "👤" },
  ];

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAssignedComplaints();
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching assigned complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints based on search query
  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return complaints;

    return complaints.filter((complaint) =>
      complaint.title?.toLowerCase().includes(query),
    );
  }, [complaints, search]);

  // Compute status metrics in a single pass
  const stats = useMemo(() => {
    return complaints.reduce(
      (acc, c) => {
        if (c.status === "Assigned") acc.assigned++;
        if (c.status === "In Progress") acc.inProgress++;
        if (c.status === "Resolved") acc.resolved++;
        if (c.priority === "High") acc.highPriority++;
        return acc;
      },
      { assigned: 0, inProgress: 0, resolved: 0, highPriority: 0 },
    );
  }, [complaints]);

  return (
    <DashboardLayout title="Officer Dashboard" links={officerLinks} user={user}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl p-8 mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 text-white shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-5xl font-black">
              Welcome back,{" "}
              <span className="text-cyan-400">{user?.name || "Officer"}</span>{" "}
              👋
            </h1>
            <p className="text-slate-300 mt-4 text-lg">
              Manage complaints assigned to your department quickly and
              efficiently.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-6 min-w-[260px]">
            <p className="text-cyan-300 text-sm">Department</p>
            <h2 className="text-2xl font-bold mt-2">
              {user?.department || "Unassigned"}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-slate-900 rounded-3xl p-6 border border-slate-700"
        >
          <ClipboardList className="text-blue-400 mb-4" size={34} />
          <p className="text-slate-400">Assigned</p>
          <h2 className="text-5xl font-black text-white mt-2">
            {stats.assigned}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-slate-900 rounded-3xl p-6 border border-slate-700"
        >
          <Clock3 className="text-yellow-400 mb-4" size={34} />
          <p className="text-slate-400">In Progress</p>
          <h2 className="text-5xl font-black text-white mt-2">
            {stats.inProgress}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-slate-900 rounded-3xl p-6 border border-slate-700"
        >
          <CheckCircle2 className="text-green-400 mb-4" size={34} />
          <p className="text-slate-400">Resolved</p>
          <h2 className="text-5xl font-black text-white mt-2">
            {stats.resolved}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-slate-900 rounded-3xl p-6 border border-slate-700"
        >
          <AlertTriangle className="text-red-400 mb-4" size={34} />
          <p className="text-slate-400">High Priority</p>
          <h2 className="text-5xl font-black text-white mt-2">
            {stats.highPriority}
          </h2>
        </motion.div>
      </div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-10"
      >
        <Search
          size={22}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search complaints..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
        />
      </motion.div>

      {/* Complaints List */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 rounded-3xl bg-slate-900 animate-pulse"
            />
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 rounded-3xl border border-slate-700 p-16 text-center"
        >
          <ClipboardList size={70} className="mx-auto text-slate-600 mb-6" />
          <h2 className="text-3xl font-bold text-white">No Complaints Found</h2>
          <p className="text-slate-400 mt-4">
            No complaints matched your search.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="grid lg:grid-cols-12">
                  {/* Complaint Image */}
                  <div className="lg:col-span-3">
                    {complaint.image ? (
                      <img
                        src={complaint.image}
                        alt={complaint.title}
                        className="w-full h-full min-h-[260px] object-cover"
                      />
                    ) : (
                      <div className="h-full min-h-[260px] bg-slate-800 flex items-center justify-center text-slate-500 font-medium">
                        No Image Attached
                      </div>
                    )}
                  </div>

                  {/* Complaint Details */}
                  <div className="lg:col-span-5 p-7 flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {complaint.title}
                      </h2>
                      <p className="text-slate-400 mt-3 leading-7 line-clamp-3">
                        {complaint.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400">Category</p>
                        <p className="text-white font-semibold mt-1">
                          {complaint.category || "General"}
                        </p>
                      </div>

                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400">Department</p>
                        <p className="text-white font-semibold mt-1">
                          {complaint.department || "N/A"}
                        </p>
                      </div>

                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400">Priority</p>
                        <p className="text-red-400 font-bold mt-1">
                          {complaint.priority || "Normal"}
                        </p>
                      </div>

                      <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400">Status</p>
                        <p className="text-cyan-400 font-bold mt-1">
                          {complaint.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Officer Actions Sidebar */}
                  <div className="lg:col-span-4 p-7 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">
                        👮 Officer Actions
                      </h2>

                      {/* Citizen Info */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-slate-800 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Citizen</p>
                          <p className="text-white font-semibold mt-1">
                            {complaint.user?.name || "Unknown Citizen"}
                          </p>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Email</p>
                          <p className="text-white break-all mt-1">
                            {complaint.user?.email || "N/A"}
                          </p>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Created</p>
                          <p className="text-white mt-1">
                            {complaint.createdAt
                              ? new Date(
                                  complaint.createdAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Update Action Form */}
                      <OfficerActions
                        complaint={complaint}
                        onUpdated={loadComplaints}
                      />
                    </div>

                    {/* View Details Navigation */}
                    <div className="mt-6">
                      <button
                        onClick={() =>
                          navigate(`/officer/complaints/${complaint._id}`)
                        }
                        className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition font-semibold text-white shadow-lg"
                      >
                        View Full Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dashboard Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center border-t border-slate-800 pt-8"
      >
        <p className="text-slate-500">
          Powered by{" "}
          <span className="text-cyan-400 font-semibold">CityOS AI</span>
        </p>
        <p className="text-slate-600 text-sm mt-2">
          Smart Civic Complaint Management Platform
        </p>
      </motion.div>
    </DashboardLayout>
  );
}

export default OfficerDashboard;
