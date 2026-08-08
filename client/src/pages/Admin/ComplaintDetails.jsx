import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

import {
  getComplaintDetails,
  getOfficers,
  reassignComplaint,
} from "../../services/adminService";

import ComplaintTimeline from "../../components/ComplaintTimeline";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [complaint, setComplaint] = useState(null);
  const [officers, setOfficers] = useState([]);

  const [selectedOfficer, setSelectedOfficer] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [showImage, setShowImage] = useState(false);

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Add Officer", path: "/admin/add-officer", icon: "👮" },
    { label: "Manage Officers", path: "/admin/officers", icon: "🧑‍💼" },
    { label: "Complaints", path: "/admin/complaints", icon: "📋" },
    { label: "Analytics", path: "/admin/analytics", icon: "📊" },
  ];

  // ==========================================
  // LOAD COMPLAINT
  // ==========================================

  const loadComplaint = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data = await getComplaintDetails(id);

      setComplaint(data);
    } catch (error) {
      console.error("Failed to load complaint:", error);

      setMessage({
        type: "error",
        text: "Unable to load complaint details.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // LOAD OFFICERS
  // ==========================================

  const loadOfficers = async () => {
    try {
      const data = await getOfficers();

      setOfficers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load officers:", error);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadComplaint();
    loadOfficers();
  }, [id]);

  // ==========================================
  // ASSIGN OFFICER
  // ==========================================

  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      setMessage({
        type: "error",
        text: "Please select an officer first.",
      });

      return;
    }

    try {
      setAssigning(true);

      setMessage({
        type: "",
        text: "",
      });

      await reassignComplaint(id, selectedOfficer);

      setSelectedOfficer("");

      await loadComplaint(false);

      setMessage({
        type: "success",
        text: "Officer assigned successfully.",
      });
    } catch (error) {
      console.error("Assignment error:", error);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to assign officer.",
      });
    } finally {
      setAssigning(false);
    }
  };

  // ==========================================
  // COPY COMPLAINT ID
  // ==========================================

  const copyComplaintId = async () => {
    try {
      await navigator.clipboard.writeText(id);

      setMessage({
        type: "success",
        text: "Complaint ID copied.",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Assigned":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ==========================================
  // PRIORITY STYLE
  // ==========================================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";

      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
        <div className="min-h-[65vh] flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-800">
              Loading complaint
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Retrieving investigation data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!complaint) {
    return (
      <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
        <div className="min-h-[65vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-4xl">
              📋
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-6">
              Complaint not found
            </h2>

            <p className="text-slate-500 mt-2">
              This complaint may have been removed or is unavailable.
            </p>

            <button
              onClick={() => navigate("/admin/complaints")}
              className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ← Back to Complaints
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Portal" user={user} links={adminLinks}>
      <div className="max-w-7xl mx-auto space-y-7">
        {/* ==========================================
            TOP NAVIGATION
        ========================================== */}

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/complaints")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
          >
            ← Back to Complaints
          </button>

          <button
            onClick={() => loadComplaint(false)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>
        </div>

        {/* ==========================================
            HERO HEADER
        ========================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-cyan-500/10" />

          <div className="relative p-7 md:p-9">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-2xl">
                  📋
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                      Complaint Investigation
                    </span>

                    <span className="w-1 h-1 rounded-full bg-slate-600" />

                    <span className="text-xs text-slate-400">CityOS Admin</span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold">
                    {complaint.title || "Untitled Complaint"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <button
                      onClick={copyComplaintId}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition"
                    >
                      ID: {id.slice(-10)}
                      <span>⧉</span>
                    </button>

                    {complaint.createdAt && (
                      <span className="text-xs text-slate-400">
                        Reported{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span
                  className={
                    "px-4 py-2 rounded-full text-sm font-semibold border " +
                    getStatusClass(complaint.status)
                  }
                >
                  ● {complaint.status || "Unknown"}
                </span>

                <span
                  className={
                    "px-4 py-2 rounded-full text-sm font-semibold border " +
                    getPriorityClass(complaint.priority)
                  }
                >
                  {complaint.priority || "Normal"} Priority
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SUCCESS / ERROR MESSAGE
        ========================================== */}

        {message.text && (
          <div
            className={
              message.type === "success"
                ? "flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700"
            }
          >
            <span className="text-lg">
              {message.type === "success" ? "✓" : "!"}
            </span>

            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {/* ==========================================
            QUICK OVERVIEW
        ========================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Category
            </p>

            <p className="font-bold text-slate-800 mt-2">
              {complaint.category || "Not specified"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Department
            </p>

            <p className="font-bold text-slate-800 mt-2">
              {complaint.department || "Not assigned"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Officer
            </p>

            <p className="font-bold text-slate-800 mt-2">
              {complaint.assignedOfficer?.name || "Not Assigned"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reported
            </p>

            <p className="font-bold text-slate-800 mt-2">
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        {/* ==========================================
            EVIDENCE + COMPLAINT INFO
        ========================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* EVIDENCE */}

          <section className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Reported Evidence
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Image submitted with the complaint.
                </p>
              </div>

              {complaint.image && (
                <button
                  onClick={() => setShowImage(true)}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  🔍 Expand
                </button>
              )}
            </div>

            <div className="p-6">
              {complaint.image ? (
                <button
                  onClick={() => setShowImage(true)}
                  className="block w-full group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                    <img
                      src={complaint.image}
                      alt="Complaint evidence"
                      className="w-full max-h-[560px] object-cover transition duration-500 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition">
                        🔍 View Full Image
                      </span>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="h-96 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
                    🖼️
                  </div>

                  <p className="font-semibold text-slate-600 mt-4">
                    No image available
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    The citizen did not submit visual evidence.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* INFORMATION */}

          <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Complaint Information
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Key information associated with this report.
            </p>

            <div className="space-y-5">
              <div className="pb-5 border-b border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Complaint Title
                </p>

                <p className="text-lg font-bold text-slate-800 mt-2">
                  {complaint.title || "Untitled"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="text-sm font-semibold text-slate-700 mt-2">
                    {complaint.category || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </p>

                  <p className="text-sm font-semibold text-slate-700 mt-2">
                    {complaint.department || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Citizen
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                    {(complaint.user?.name || "C").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">
                      {complaint.user?.name || "Unknown Citizen"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {complaint.user?.email || "No email available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Officer
                </p>

                {complaint.assignedOfficer?.name ? (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
                      👮
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">
                        {complaint.assignedOfficer.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Current case officer
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
                    ⚠ No officer assigned
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ==========================================
            DESCRIPTION
        ========================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              📝
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Citizen Description
              </h2>

              <p className="text-sm text-slate-500">
                Original details provided with the report.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-slate-700 leading-8 whitespace-pre-wrap">
              {complaint.description || "No description was provided."}
            </p>
          </div>
        </section>

        {/* ==========================================
            AI ANALYSIS
        ========================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-blue-500/5" />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
                  🤖
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-950">
                    AI Analysis
                  </h2>

                  <p className="text-sm text-blue-700 mt-1">
                    Automated complaint assessment.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 text-xs font-bold text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                AI VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Summary
                </p>

                <p className="text-slate-700 leading-7 mt-3">
                  {complaint.aiSummary ||
                    "AI summary is not available for this complaint."}
                </p>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-blue-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Suggested Department
                  </p>

                  <p className="font-bold text-slate-800 mt-2">
                    {complaint.department || "Not available"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-blue-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Detected Priority
                  </p>

                  <span
                    className={
                      "inline-flex mt-2 px-3 py-1.5 rounded-full text-xs font-bold border " +
                      getPriorityClass(complaint.priority)
                    }
                  >
                    {complaint.priority || "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            TIMELINE
        ========================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              ◷
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Complaint Timeline
              </h2>

              <p className="text-sm text-slate-500">
                Track the current complaint lifecycle.
              </p>
            </div>
          </div>

          <ComplaintTimeline status={complaint.status} />
        </section>

        {/* ==========================================
            ASSIGNMENT CONTROL CENTER
        ========================================== */}

        <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-purple-500/10" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center text-xl">
                  👮
                </div>

                <div>
                  <h2 className="text-xl font-bold">Officer Assignment</h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Assign or reassign this complaint to a responsible officer.
                  </p>
                </div>
              </div>

              {complaint.assignedOfficer?.name && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    👮
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Currently assigned</p>

                    <p className="text-sm font-semibold">
                      {complaint.assignedOfficer.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-7 flex flex-col md:flex-row gap-4">
              <select
                value={selectedOfficer}
                onChange={(e) => {
                  setSelectedOfficer(e.target.value);

                  setMessage({
                    type: "",
                    text: "",
                  });
                }}
                className="flex-1 px-4 py-3.5 rounded-xl bg-white text-slate-700 border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                <option value="">Select an officer</option>

                {officers.map((officer) => (
                  <option key={officer._id} value={officer._id}>
                    {officer.name} — {officer.department}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignOfficer}
                disabled={assigning || !selectedOfficer}
                className="px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {assigning ? "Assigning..." : "Assign Officer →"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ==========================================
          IMAGE MODAL
      ========================================== */}

      {showImage && complaint.image && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setShowImage(false)}
        >
          <div
            className="relative max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImage(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-xl"
            >
              ×
            </button>

            <img
              src={complaint.image}
              alt="Complaint evidence enlarged"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ComplaintDetails;
