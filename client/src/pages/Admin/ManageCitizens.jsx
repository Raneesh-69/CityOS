import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

import {
  getAllCitizens,
  updateCitizen,
  deleteCitizen,
  updateCitizenStatus,
} from "../../services/adminService";

function ManageCitizens() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // ADMIN SIDEBAR
  // ==========================================
  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Add Officer", path: "/admin/add-officer", icon: "👮" },
    { label: "Manage Officers", path: "/admin/officers", icon: "🧑‍💼" },
    { label: "Manage Citizens", path: "/admin/citizens", icon: "👥" },
    { label: "Complaints", path: "/admin/complaints", icon: "📋" },
    { label: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  // ==========================================
  // LOAD CITIZENS
  // ==========================================

  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {
    try {
      setLoading(true);

      const data = await getAllCitizens();

      setCitizens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load citizens:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to load citizen accounts.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE CITIZEN
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this citizen account?\n\nTheir account will no longer be able to log in.",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteCitizen(id);

      setMessage({
        type: "success",
        text: "Citizen account deleted successfully.",
      });

      await loadCitizens();
    } catch (error) {
      console.error("Failed to delete citizen:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to delete citizen account.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (citizen) => {
    setSelectedCitizen(citizen);

    setEditForm({
      name: citizen.name || "",
      email: citizen.email || "",
      phone: citizen.phone || "",
    });

    setMessage({
      type: "",
      text: "",
    });

    setShowEditModal(true);
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE CITIZEN
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim() || !editForm.email.trim()) {
      setMessage({
        type: "error",
        text: "Name and email are required.",
      });

      return;
    }

    try {
      setActionLoading(true);

      await updateCitizen(selectedCitizen._id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
      });

      setShowEditModal(false);
      setSelectedCitizen(null);

      setMessage({
        type: "success",
        text: "Citizen account updated successfully.",
      });

      await loadCitizens();
    } catch (error) {
      console.error("Failed to update citizen:", error);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update citizen.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const handleStatusChange = async (citizen) => {
    const currentStatus = citizen.accountStatus || "active";

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const actionText = newStatus === "active" ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${citizen.name}'s account?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await updateCitizenStatus(citizen._id, newStatus);

      setMessage({
        type: "success",
        text: `Citizen account ${newStatus}.`,
      });

      await loadCitizens();
    } catch (error) {
      console.error("Failed to update citizen status:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update account status.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FILTER CITIZENS
  // ==========================================

  const searchValue = search.toLowerCase().trim();

  const filteredCitizens = citizens.filter((citizen) => {
    const name = (citizen.name || "").toLowerCase();
    const email = (citizen.email || "").toLowerCase();
    const phone = (citizen.phone || "").toLowerCase();

    const matchesSearch =
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue);

    const citizenStatus = citizen.accountStatus || "active";

    const matchesStatus =
      statusFilter === "All" || citizenStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const activeCitizens = citizens.filter(
    (citizen) => (citizen.accountStatus || "active") === "active",
  ).length;

  const inactiveCitizens = citizens.filter(
    (citizen) => citizen.accountStatus === "inactive",
  ).length;

  const totalComplaints = citizens.reduce(
    (total, citizen) => total + (Number(citizen.complaintCount) || 0),
    0,
  );

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    if (status === "inactive") {
      return "bg-slate-100 text-slate-600";
    }

    return "bg-emerald-50 text-emerald-700";
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="w-1 h-14 rounded-full bg-blue-600 mt-1" />

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Citizen Management
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                Manage Citizens
              </h1>

              <p className="text-slate-500 mt-2">
                View, search and manage registered citizen accounts.
              </p>
            </div>
          </div>

          <button
            onClick={loadCitizens}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5
              rounded-xl
              bg-white
              border border-slate-200
              text-slate-600
              font-semibold
              shadow-sm
              hover:border-blue-300
              hover:text-blue-600
              hover:shadow-md
              disabled:opacity-50
              transition
            "
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>
        </div>

        {/* ==========================================
            SUMMARY CARDS
        ========================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* TOTAL */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-slate-200
              shadow-sm
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Citizens
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {citizens.length}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Registered accounts
                </p>
              </div>

              <div
                className="
                  h-11 w-11
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex items-center justify-center
                  text-xl
                "
              >
                👥
              </div>
            </div>
          </div>

          {/* ACTIVE */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-slate-200
              shadow-sm
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {activeCitizens}
                </p>

                <p className="text-xs text-slate-400 mt-1">Can access CityOS</p>
              </div>

              <div
                className="
                  h-11 w-11
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  flex items-center justify-center
                  text-xl
                "
              >
                ✓
              </div>
            </div>
          </div>

          {/* INACTIVE */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-slate-200
              shadow-sm
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Inactive
                </p>

                <p className="text-3xl font-bold text-slate-600 mt-2">
                  {inactiveCitizens}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Restricted accounts
                </p>
              </div>

              <div
                className="
                  h-11 w-11
                  rounded-xl
                  bg-slate-100
                  text-slate-600
                  flex items-center justify-center
                  text-xl
                "
              >
                ⏸
              </div>
            </div>
          </div>

          {/* COMPLAINTS */}

          <div
            className="
              bg-white
              rounded-2xl
              border border-slate-200
              shadow-sm
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Complaints
                </p>

                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {totalComplaints}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Submitted by citizens
                </p>
              </div>

              <div
                className="
                  h-11 w-11
                  rounded-xl
                  bg-purple-50
                  text-purple-600
                  flex items-center justify-center
                  text-xl
                "
              >
                📋
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            MESSAGE
        ========================================== */}

        {message.text && (
          <div
            className={
              message.type === "success"
                ? "px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium"
                : "px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
            }
          >
            <div className="flex items-center gap-2">
              <span>{message.type === "success" ? "✓" : "!"}</span>

              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* ==========================================
            FILTER BAR
        ========================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            p-5
          "
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* SEARCH */}

            <div className="relative flex-1">
              <span
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  transition
                "
              />
            </div>

            {/* STATUS */}

            <div className="lg:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  w-full
                  px-4 py-3
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  text-slate-700
                  outline-none
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  transition
                  cursor-pointer
                "
              >
                <option value="All">All Statuses</option>

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div
            className="
              flex items-center justify-between
              mt-4 pt-4
              border-t border-slate-100
            "
          >
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredCitizens.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {citizens.length}
              </span>{" "}
              citizens
            </p>

            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* ==========================================
            CITIZEN TABLE
        ========================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            overflow-hidden
          "
        >
          <div
            className="
              px-6 py-5
              border-b border-slate-200
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registered Citizens
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage citizen accounts and activity.
                </p>
              </div>

              <div
                className="
                  hidden sm:flex
                  items-center gap-2
                  px-3 py-1.5
                  rounded-full
                  bg-blue-50
                  text-blue-700
                  text-xs
                  font-semibold
                "
              >
                {filteredCitizens.length} Results
              </div>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="py-20 text-center">
              <div
                className="
                  inline-block
                  h-8 w-8
                  rounded-full
                  border-4
                  border-slate-200
                  border-t-blue-600
                  animate-spin
                "
              />

              <p className="text-sm text-slate-500 mt-4">Loading citizens...</p>
            </div>
          ) : filteredCitizens.length === 0 ? (
            /* EMPTY STATE */

            <div className="py-20 text-center px-6">
              <div
                className="
                  mx-auto
                  h-16 w-16
                  rounded-2xl
                  bg-slate-100
                  flex items-center justify-center
                  text-3xl
                "
              >
                👥
              </div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  mt-5
                "
              >
                No citizens found
              </h3>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-2
                "
              >
                Try changing your search or status filter.
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="
                    mt-5
                    px-4 py-2
                    rounded-lg
                    bg-blue-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-blue-700
                    transition
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* TABLE */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr
                    className="
                      bg-slate-50
                      border-b border-slate-200
                    "
                  >
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Citizen
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Complaints
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registered
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCitizens.map((citizen) => {
                    const status = citizen.accountStatus || "active";

                    return (
                      <tr
                        key={citizen._id}
                        className="
                            border-b
                            border-slate-100
                            hover:bg-blue-50/40
                            transition
                          "
                      >
                        {/* CITIZEN */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                  h-11 w-11
                                  shrink-0
                                  rounded-xl
                                  bg-blue-100
                                  text-blue-700
                                  flex items-center
                                  justify-center
                                  font-bold
                                  text-lg
                                "
                            >
                              {(citizen.name || "C").charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="
                                    font-semibold
                                    text-slate-800
                                    truncate
                                    max-w-[220px]
                                  "
                              >
                                {citizen.name || "Unnamed Citizen"}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                Citizen
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-700 whitespace-nowrap">
                              {citizen.email || "No email"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {citizen.phone || "No phone number"}
                            </p>
                          </div>
                        </td>

                        {/* COMPLAINTS */}

                        <td className="px-6 py-5 text-center">
                          <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-3 py-1.5
                                rounded-lg
                                bg-purple-50
                                text-purple-700
                                text-sm
                                font-semibold
                              "
                          >
                            📋 {Number(citizen.complaintCount) || 0}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5 text-center">
                          <span
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                px-3 py-1.5
                                rounded-full
                                text-xs
                                font-semibold
                                ${getStatusStyle(status)}
                              `}
                          >
                            <span
                              className={`
                                  h-2 w-2
                                  rounded-full
                                  ${
                                    status === "active"
                                      ? "bg-emerald-500"
                                      : "bg-slate-400"
                                  }
                                `}
                            />

                            {status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* REGISTERED */}

                        <td className="px-6 py-5">
                          <p className="text-sm text-slate-700">
                            {citizen.createdAt
                              ? new Date(citizen.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-2
                              "
                          >
                            <button
                              onClick={() => handleEdit(citizen)}
                              disabled={actionLoading}
                              className="
                                  px-3 py-2
                                  rounded-lg
                                  border
                                  border-blue-200
                                  bg-blue-50
                                  text-blue-600
                                  text-sm
                                  font-semibold
                                  hover:bg-blue-100
                                  disabled:opacity-50
                                  transition
                                "
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleStatusChange(citizen)}
                              disabled={actionLoading}
                              className="
                                  px-3 py-2
                                  rounded-lg
                                  border
                                  border-amber-200
                                  bg-amber-50
                                  text-amber-700
                                  text-sm
                                  font-semibold
                                  hover:bg-amber-100
                                  disabled:opacity-50
                                  transition
                                "
                            >
                              {status === "active" ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              onClick={() => handleDelete(citizen._id)}
                              disabled={actionLoading}
                              className="
                                  px-3 py-2
                                  rounded-lg
                                  border
                                  border-red-200
                                  bg-red-50
                                  text-red-600
                                  text-sm
                                  font-semibold
                                  hover:bg-red-100
                                  disabled:opacity-50
                                  transition
                                "
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ==========================================
          EDIT CITIZEN MODAL
      ========================================== */}

      {showEditModal && selectedCitizen && (
        <div
          className="
              fixed inset-0
              z-50
              bg-slate-950/50
              backdrop-blur-sm
              flex items-center
              justify-center
              p-4
            "
        >
          <div
            className="
                w-full max-w-xl
                bg-white
                rounded-2xl
                shadow-2xl
                overflow-hidden
              "
          >
            {/* HEADER */}

            <div
              className="
                  px-6 py-5
                  border-b border-slate-200
                  flex items-center
                  justify-between
                "
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Citizen Management
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Edit Citizen
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCitizen(null);
                }}
                className="
                    h-9 w-9
                    rounded-lg
                    bg-slate-100
                    text-slate-500
                    hover:bg-slate-200
                    hover:text-slate-700
                    transition
                  "
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Citizen Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="
                      w-full
                      px-4 py-3
                      rounded-xl
                      border border-slate-200
                      bg-slate-50
                      text-slate-900
                      outline-none
                      focus:bg-white
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      transition
                    "
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        text-slate-900
                        outline-none
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                        transition
                      "
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        text-slate-900
                        outline-none
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                        transition
                      "
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCitizen(null);
                  }}
                  className="
                      flex-1
                      px-5 py-3
                      rounded-xl
                      border border-slate-200
                      text-slate-600
                      font-semibold
                      hover:bg-slate-50
                      transition
                    "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="
                      flex-1
                      px-5 py-3
                      rounded-xl
                      bg-blue-600
                      text-white
                      font-semibold
                      hover:bg-blue-700
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition
                    "
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageCitizens;
