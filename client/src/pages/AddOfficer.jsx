import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function AddOfficer() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Add Officer", path: "/admin/add-officer", icon: "👮" },
    { label: "Manage Officers", path: "/admin/officers", icon: "🧑‍💼" },
    { label: "Complaints", path: "/admin/complaints", icon: "📋" },
    { label: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.phone.trim() ||
      !form.department
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/admin/create-officer", form);

      setMessage(data.message || "Officer created successfully.");

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        department: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create officer. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex items-start gap-3 mb-8">
          <div className="w-1 h-14 rounded-full bg-blue-600"></div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Officer Management
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
              Add Officer
            </h1>

            <p className="text-slate-500 mt-2">
              Register a new officer and assign them to a department.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* INFORMATION PANEL */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-7 text-white shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl mb-6">
              👮
            </div>

            <h2 className="text-2xl font-bold">Officer Registration</h2>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Create an official CityOS officer account for managing citizen
              complaints and city operations.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">Department Assignment</p>

                  <p className="text-sm text-slate-400 mt-1">
                    Assign the officer to the appropriate department.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">Secure Credentials</p>

                  <p className="text-sm text-slate-400 mt-1">
                    Each officer receives their own login credentials.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">Complaint Management</p>

                  <p className="text-sm text-slate-400 mt-1">
                    Officers can manage complaints assigned to them.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Admin Access
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Only authorized administrators should create officer accounts.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Officer Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter the officer's information below.
              </p>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Officer Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter officer name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="officer@cityos.gov"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    inputMode="numeric"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className="w-full px-4 py-3 pr-20 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Minimum 6 characters.
                </p>
              </div>

              {/* DEPARTMENT */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Department
                </label>

                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
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

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating..." : "Create Officer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddOfficer;
