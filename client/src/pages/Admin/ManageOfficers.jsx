import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

import {
  getAllOfficers,
  updateOfficer,
  deleteOfficer,
} from "../../services/adminService";

function ManageOfficers() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [officers, setOfficers] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "🏠",
    },
    {
      label: "Add Officer",
      path: "/admin/add-officer",
      icon: "➕",
    },
    {
      label: "Manage Officers",
      path: "/admin/officers",
      icon: "👮",
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

  // ==========================================
  // LOAD OFFICERS
  // ==========================================

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);

      const data = await getAllOfficers();

      setOfficers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load officers:", error);

      setMessage({
        type: "error",
        text: "Failed to load officers.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE OFFICER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this officer?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteOfficer(id);

      setMessage({
        type: "success",
        text: "Officer deleted successfully.",
      });

      await loadOfficers();
    } catch (error) {
      console.error("Failed to delete officer:", error);

      setMessage({
        type: "error",
        text: "Failed to delete officer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (officer) => {
    setSelectedOfficer(officer);

    setEditForm({
      name: officer.name || "",
      email: officer.email || "",
      phone: officer.phone || "",
      department: officer.department || "",
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
  // UPDATE OFFICER
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim() ||
      !editForm.department
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all officer details.",
      });

      return;
    }

    try {
      setActionLoading(true);

      await updateOfficer(selectedOfficer._id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        department: editForm.department,
      });

      setShowEditModal(false);
      setSelectedOfficer(null);

      setMessage({
        type: "success",
        text: "Officer updated successfully.",
      });

      await loadOfficers();
    } catch (error) {
      console.error("Failed to update officer:", error);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update officer.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const departmentSet = new Set();

  officers.forEach((officer) => {
    if (officer.department) {
      departmentSet.add(officer.department);
    }
  });

  const departments = ["All", ...Array.from(departmentSet)];

  // ==========================================
  // FILTER OFFICERS
  // ==========================================

  const searchValue = search.toLowerCase().trim();

  const filteredOfficers = officers.filter((officer) => {
    const name = (officer.name || "").toLowerCase();
    const email = (officer.email || "").toLowerCase();
    const phone = (officer.phone || "").toLowerCase();
    const department = (officer.department || "").toLowerCase();

    const matchesSearch =
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue) ||
      department.includes(searchValue);

    const matchesDepartment =
      departmentFilter === "All" || officer.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // ==========================================
  // WORKLOAD
  // ==========================================

  const getWorkloadText = (count) => {
    const value = Number(count) || 0;

    if (value === 0) {
      return "No complaints";
    }

    if (value <= 3) {
      return "Light workload";
    }

    if (value <= 7) {
      return "Moderate workload";
    }

    return "High workload";
  };

  const getWorkloadStyle = (count) => {
    const value = Number(count) || 0;

    if (value === 0) {
      return "bg-slate-100 text-slate-600";
    }

    if (value <= 3) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (value <= 7) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-700";
  };

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
                Officer Management
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                Manage Officers
              </h1>

              <p className="text-slate-500 mt-2">
                View, search and manage registered city officers.
              </p>
            </div>
          </div>

          <button
            onClick={loadOfficers}
            disabled={loading}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-white
              border
              border-slate-200
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Officers
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {officers.length}
                </p>
              </div>

              <div
                className="
                h-11
                w-11
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                text-xl
              "
              >
                👮
              </div>
            </div>
          </div>

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Departments
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {departmentSet.size}
                </p>
              </div>

              <div
                className="
                h-11
                w-11
                rounded-xl
                bg-purple-50
                text-purple-600
                flex
                items-center
                justify-center
                text-xl
              "
              >
                🏢
              </div>
            </div>
          </div>

          <div
            className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-5
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned Complaints
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {officers.reduce(
                    (total, officer) =>
                      total + (Number(officer.assignedCount) || 0),
                    0,
                  )}
                </p>
              </div>

              <div
                className="
                h-11
                w-11
                rounded-xl
                bg-amber-50
                text-amber-600
                flex
                items-center
                justify-center
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
          border
          border-slate-200
          shadow-sm
          p-5
        "
        >
          <div
            className="
            flex
            flex-col
            lg:flex-row
            gap-4
          "
          >
            {/* SEARCH */}

            <div className="relative flex-1">
              <span
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by name, email, phone or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-slate-200
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

            {/* DEPARTMENT */}

            <div className="lg:w-64">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-200
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
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="
            flex
            items-center
            justify-between
            mt-4
            pt-4
            border-t
            border-slate-100
          "
          >
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredOfficers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {officers.length}
              </span>{" "}
              officers
            </p>

            {(search || departmentFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setDepartmentFilter("All");
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
            OFFICERS TABLE
        ========================================== */}

        <section
          className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
        >
          <div
            className="
            px-6
            py-5
            border-b
            border-slate-200
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registered Officers
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage officer accounts and assignments.
                </p>
              </div>

              <div
                className="
                hidden
                sm:flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-blue-50
                text-blue-700
                text-xs
                font-semibold
              "
              >
                {filteredOfficers.length} Results
              </div>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="py-20 text-center">
              <div
                className="
                inline-block
                h-8
                w-8
                rounded-full
                border-4
                border-slate-200
                border-t-blue-600
                animate-spin
              "
              />

              <p className="text-sm text-slate-500 mt-4">Loading officers...</p>
            </div>
          ) : filteredOfficers.length === 0 ? (
            /* EMPTY STATE */

            <div className="py-20 text-center px-6">
              <div
                className="
                mx-auto
                h-16
                w-16
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
                text-3xl
              "
              >
                👮
              </div>

              <h3
                className="
                text-lg
                font-bold
                text-slate-800
                mt-5
              "
              >
                No officers found
              </h3>

              <p
                className="
                text-sm
                text-slate-500
                mt-2
              "
              >
                Try changing your search or department filter.
              </p>

              {(search || departmentFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setDepartmentFilter("All");
                  }}
                  className="
                    mt-5
                    px-4
                    py-2
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
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr
                    className="
                    bg-slate-50
                    border-b
                    border-slate-200
                  "
                  >
                    <th
                      className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                    >
                      Officer
                    </th>

                    <th
                      className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                    >
                      Department
                    </th>

                    <th
                      className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                    >
                      Contact
                    </th>

                    <th
                      className="
                      px-6
                      py-4
                      text-center
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                    >
                      Workload
                    </th>

                    <th
                      className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOfficers.map((officer) => {
                    const assignedCount = Number(officer.assignedCount) || 0;

                    const workloadText = getWorkloadText(assignedCount);

                    const workloadStyle = getWorkloadStyle(assignedCount);

                    return (
                      <tr
                        key={officer._id}
                        className="
                          border-b
                          border-slate-100
                          hover:bg-blue-50/40
                          transition
                        "
                      >
                        {/* OFFICER */}

                        <td className="px-6 py-5">
                          <div
                            className="
                            flex
                            items-center
                            gap-3
                          "
                          >
                            <div
                              className="
                              h-11
                              w-11
                              shrink-0
                              rounded-xl
                              bg-blue-100
                              text-blue-700
                              flex
                              items-center
                              justify-center
                              font-bold
                              text-lg
                            "
                            >
                              {(officer.name || "O").charAt(0).toUpperCase()}
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
                                {officer.name || "Unnamed Officer"}
                              </p>

                              <p
                                className="
                                text-xs
                                text-slate-400
                                mt-1
                              "
                              >
                                Officer
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-6 py-5">
                          <div
                            className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-lg
                            bg-slate-100
                            text-slate-700
                            text-sm
                            font-medium
                          "
                          >
                            <span>🏢</span>

                            <span>{officer.department || "Not Assigned"}</span>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p
                              className="
                              text-sm
                              text-slate-700
                              whitespace-nowrap
                            "
                            >
                              {officer.email || "No email"}
                            </p>

                            <p
                              className="
                              text-xs
                              text-slate-400
                            "
                            >
                              {officer.phone || "No phone number"}
                            </p>
                          </div>
                        </td>

                        {/* WORKLOAD */}

                        <td className="px-6 py-5 text-center">
                          <div
                            className="
                            flex
                            flex-col
                            items-center
                            gap-1.5
                          "
                          >
                            <span
                              className="
                              text-lg
                              font-bold
                              text-slate-800
                            "
                            >
                              {assignedCount}
                            </span>

                            <span
                              className={
                                "px-2.5 py-1 rounded-full text-xs font-semibold " +
                                workloadStyle
                              }
                            >
                              {workloadText}
                            </span>
                          </div>
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
                              onClick={() => handleEdit(officer)}
                              disabled={actionLoading}
                              className="
                                px-3
                                py-2
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
                              onClick={() => handleDelete(officer._id)}
                              disabled={actionLoading}
                              className="
                                px-3
                                py-2
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
          EDIT OFFICER MODAL
      ========================================== */}

      {showEditModal && selectedOfficer && (
        <div
          className="
          fixed
          inset-0
          z-50
          bg-slate-950/50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        "
        >
          <div
            className="
            w-full
            max-w-xl
            bg-white
            rounded-2xl
            shadow-2xl
            overflow-hidden
          "
          >
            {/* MODAL HEADER */}

            <div
              className="
              px-6
              py-5
              border-b
              border-slate-200
              flex
              items-center
              justify-between
            "
            >
              <div>
                <p
                  className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-600
                "
                >
                  Officer Management
                </p>

                <h2
                  className="
                  text-xl
                  font-bold
                  text-slate-900
                  mt-1
                "
                >
                  Edit Officer
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOfficer(null);
                }}
                className="
                  h-9
                  w-9
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

            {/* MODAL FORM */}

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label
                  className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
                >
                  Officer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
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

              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
              >
                <div>
                  <label
                    className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
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
                  <label
                    className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                  >
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
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

              <div>
                <label
                  className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
                >
                  Department
                </label>

                <select
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
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
                  <option value="">Select Department</option>

                  <option value="Electricity Department">
                    Electricity Department
                  </option>

                  <option value="Roads Department">Roads Department</option>

                  <option value="Water Department">Water Department</option>

                  <option value="Sanitation Department">
                    Sanitation Department
                  </option>

                  <option value="Municipal Department">
                    Municipal Department
                  </option>
                </select>
              </div>

              {/* MODAL ACTIONS */}

              <div
                className="
                flex
                gap-3
                pt-3
              "
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedOfficer(null);
                  }}
                  className="
                    flex-1
                    px-5
                    py-3
                    rounded-xl
                    border
                    border-slate-200
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
                    px-5
                    py-3
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

export default ManageOfficers;
