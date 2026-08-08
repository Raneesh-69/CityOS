import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getAllComplaints } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

function ManageComplaints() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Add Officer", path: "/admin/add-officer", icon: "👮" },
    { label: "Manage Officers", path: "/admin/officers", icon: "🧑‍💼" },
    { label: "Complaints", path: "/admin/complaints", icon: "📋" },
    { label: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "All",
    ...new Set(
      complaints.map((complaint) => complaint.department).filter(Boolean),
    ),
  ];

  const filteredComplaints = complaints.filter((complaint) => {
    const title = (complaint.title || "").toLowerCase();
    const citizen = (complaint.user?.name || "").toLowerCase();
    const department = (complaint.department || "").toLowerCase();
    const query = search.toLowerCase().trim();

    const matchesSearch =
      title.includes(query) ||
      citizen.includes(query) ||
      department.includes(query);

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || complaint.priority === priorityFilter;

    const matchesDepartment =
      departmentFilter === "All" || complaint.department === departmentFilter;

    return (
      matchesSearch && matchesStatus && matchesPriority && matchesDepartment
    );
  });

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;

  const progressCount = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved",
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Assigned":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setDepartmentFilter("All");
  };

  const filtersActive =
    search ||
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    departmentFilter !== "All";

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-1 h-14 bg-blue-600 rounded-full" />

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                City Operations
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                Complaint Management
              </h1>

              <p className="text-slate-500 mt-2">
                Monitor and manage citizen complaints from one place.
              </p>
            </div>
          </div>

          <button
            onClick={loadComplaints}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:border-blue-400 hover:text-blue-600 transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Complaints
            </p>

            <div className="flex justify-between items-center mt-3">
              <p className="text-3xl font-bold text-slate-900">
                {complaints.length}
              </p>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                📋
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending
            </p>

            <div className="flex justify-between items-center mt-3">
              <p className="text-3xl font-bold text-yellow-600">
                {pendingCount}
              </p>

              <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Progress
            </p>

            <div className="flex justify-between items-center mt-3">
              <p className="text-3xl font-bold text-blue-600">
                {progressCount}
              </p>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                🚧
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resolved
            </p>

            <div className="flex justify-between items-center mt-3">
              <p className="text-3xl font-bold text-green-600">
                {resolvedCount}
              </p>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <input
                type="text"
                placeholder="🔍 Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-blue-500"
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department === "All" ? "All Departments" : department}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {filteredComplaints.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {complaints.length}
              </span>{" "}
              complaints
            </p>

            {filtersActive && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Citizen Complaints
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Review reported civic issues and open their details.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

              <p className="text-sm text-slate-500 mt-4">
                Loading complaints...
              </p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                📋
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-5">
                No complaints found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your search or filters.
              </p>

              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Complaint
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Citizen
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Officer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b border-slate-100 hover:bg-blue-50/40 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="max-w-[220px]">
                          <p className="font-semibold text-slate-800 truncate">
                            {complaint.title || "Untitled Complaint"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {complaint._id ? complaint._id.slice(-8) : "-"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
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
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold whitespace-nowrap">
                          🏢 {complaint.department || "Not Assigned"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={
                            "inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border " +
                            getPriorityClass(complaint.priority)
                          }
                        >
                          {complaint.priority || "Normal"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border " +
                            getStatusClass(complaint.status)
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />

                          {complaint.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {complaint.assignedOfficer?.name ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              👮
                            </div>

                            <span className="text-sm text-slate-700 whitespace-nowrap">
                              {complaint.assignedOfficer.name}
                            </span>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold whitespace-nowrap">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/complaints/${complaint._id}`)
                          }
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageComplaints;
