import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import AdminCharts from "../../components/AdminCharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getRecentComplaints,
} from "../../services/adminService";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    totalOfficers: 0,
    departments: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "🏠",
    },
    {
      label: "Add Officer",
      path: "/admin/add-officer",
      icon: "👮",
    },
    {
      label: "Manage Officers",
      path: "/admin/officers",
      icon: "🧑‍💼",
    },
    {
      label: "Manage Citizens",
      path: "/admin/citizens",
      icon: "👥",
    },
    {
      label: "Complaints",
      path: "/admin/complaints",
      icon: "📋",
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: "📊",
    },
  ];
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const statsData = await getDashboardStats();
      setStats(statsData);

      const complaintsData = await getRecentComplaints();
      setRecentComplaints(complaintsData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "Pending") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "Assigned") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  const resolutionRate =
    stats.totalComplaints > 0
      ? Math.round((stats.resolved / stats.totalComplaints) * 100)
      : 0;

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="space-y-8">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="w-1 h-14 rounded-full bg-gradient-to-b from-blue-600 to-cyan-500" />

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Admin Dashboard
              </h1>

              <p className="text-slate-500 mt-2 text-base md:text-lg">
                Monitor and manage your city's operations from one place.
              </p>
            </div>
          </div>

          <button
            onClick={loadDashboard}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5
              rounded-xl
              bg-white
              border border-slate-200
              text-slate-600
              font-medium
              shadow-sm
              hover:border-blue-300
              hover:text-blue-600
              hover:shadow-md
              transition
            "
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>
        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints}
            icon="📋"
            color="#2563eb"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon="⏳"
            color="#eab308"
          />

          <StatCard
            title="Assigned"
            value={stats.assigned}
            icon="👤"
            color="#9333ea"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="🚧"
            color="#0891b2"
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon="✅"
            color="#16a34a"
          />

          <StatCard
            title="Active Officers"
            value={stats.totalOfficers}
            icon="👮"
            color="#4f46e5"
          />
        </div>

        {/* QUICK ACTIONS */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Control Center
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Quickly access the most important administrative tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/admin/add-officer")}
              className="
                group text-left p-5 rounded-xl
                border border-slate-200
                bg-slate-50
                hover:bg-blue-50
                hover:border-blue-200
                transition
              "
            >
              <div
                className="
                w-11 h-11 rounded-xl
                bg-blue-100 text-blue-600
                flex items-center justify-center
                text-xl mb-4
                group-hover:scale-105 transition
              "
              >
                👮
              </div>

              <h3 className="font-semibold text-slate-900">Add Officer</h3>

              <p className="text-sm text-slate-500 mt-1">
                Register a new city officer.
              </p>

              <div className="mt-4 text-sm font-medium text-blue-600">
                Open →
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/complaints")}
              className="
                group text-left p-5 rounded-xl
                border border-slate-200
                bg-slate-50
                hover:bg-emerald-50
                hover:border-emerald-200
                transition
              "
            >
              <div
                className="
                w-11 h-11 rounded-xl
                bg-emerald-100 text-emerald-600
                flex items-center justify-center
                text-xl mb-4
                group-hover:scale-105 transition
              "
              >
                📋
              </div>

              <h3 className="font-semibold text-slate-900">
                Manage Complaints
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Review and assign citizen complaints.
              </p>

              <div className="mt-4 text-sm font-medium text-emerald-600">
                Open →
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/analytics")}
              className="
                group text-left p-5 rounded-xl
                border border-slate-200
                bg-slate-50
                hover:bg-purple-50
                hover:border-purple-200
                transition
              "
            >
              <div
                className="
                w-11 h-11 rounded-xl
                bg-purple-100 text-purple-600
                flex items-center justify-center
                text-xl mb-4
                group-hover:scale-105 transition
              "
              >
                📊
              </div>

              <h3 className="font-semibold text-slate-900">View Analytics</h3>

              <p className="text-sm text-slate-500 mt-1">
                Analyze city performance and trends.
              </p>

              <div className="mt-4 text-sm font-medium text-purple-600">
                Open →
              </div>
            </button>
          </div>
        </section>

        {/* ANALYTICS */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
              City Intelligence
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Operational Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Visual overview of current complaint activity.
            </p>
          </div>

          <AdminCharts stats={stats} />
        </section>

        {/* RECENT COMPLAINTS */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Latest Activity
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Recent Complaints
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Latest citizen complaints received by the city.
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/complaints")}
                className="
                  px-4 py-2 rounded-lg
                  border border-slate-200
                  bg-white
                  text-sm font-medium
                  text-blue-600
                  hover:bg-blue-50
                  hover:border-blue-200
                  transition
                "
              >
                View All →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {recentComplaints.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">📋</div>

                <h3 className="text-slate-800 font-semibold">
                  No recent complaints
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  New citizen complaints will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Complaint
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Citizen
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Officer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="
                        border-b border-slate-100
                        hover:bg-blue-50/40
                        transition
                      "
                    >
                      <td className="px-6 py-5">
                        <div className="max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">
                            {complaint.title || "Untitled Complaint"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {complaint._id?.slice(-8) || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                            h-9 w-9 rounded-full
                            bg-blue-100 text-blue-700
                            flex items-center justify-center
                            text-sm font-bold
                          "
                          >
                            {(complaint.user?.name || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="text-sm text-slate-700 whitespace-nowrap">
                            {complaint.user?.name || "Unknown Citizen"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {complaint.department || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border " +
                            getStatusStyle(complaint.status)
                          }
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                          {complaint.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {complaint.assignedOfficer?.name ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="
                              h-8 w-8 rounded-lg
                              bg-purple-100 text-purple-600
                              flex items-center justify-center
                              text-xs
                            "
                            >
                              👮
                            </div>

                            <span className="text-sm text-slate-700 whitespace-nowrap">
                              {complaint.assignedOfficer.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-amber-600 font-medium">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            p-6
          "
          >
            <p className="text-sm text-slate-500">Departments</p>

            <div className="flex items-end gap-3 mt-2">
              <span className="text-3xl font-bold text-slate-900">
                {stats.departments}
              </span>

              <span className="text-sm text-slate-500 mb-1">
                active departments
              </span>
            </div>
          </div>

          <div
            className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            p-6
          "
          >
            <p className="text-sm text-slate-500">Resolution Rate</p>

            <div className="flex items-end gap-3 mt-2">
              <span className="text-3xl font-bold text-emerald-600">
                {resolutionRate}%
              </span>

              <span className="text-sm text-slate-500 mb-1">
                complaints resolved
              </span>
            </div>

            <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-500
                  to-cyan-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${resolutionRate}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
