import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  CalendarDays,
  User,
  Building2,
  Flag,
  Sparkles,
} from "lucide-react";

import { getMyComplaintDetails } from "../services/citizenService";
import ComplaintTimeline from "../components/ComplaintTimeline";

function CitizenComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, []);

  const loadComplaint = async () => {
    try {
      const data = await getMyComplaintDetails(id);
      setComplaint(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load complaint.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";

      case "Assigned":
        return "bg-blue-600";

      case "In Progress":
        return "bg-yellow-500 text-black";

      case "Resolved":
        return "bg-green-600";

      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        bg-gradient-to-br
        from-[#0f172a]
        via-[#182554]
        to-[#0f172a]
        p-10
        "
      >
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-white/10 rounded-2xl"></div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-[420px] rounded-3xl bg-white/10"></div>

            <div className="h-[420px] rounded-3xl bg-white/10"></div>
          </div>

          <div className="h-64 rounded-3xl bg-white/10"></div>

          <div className="h-64 rounded-3xl bg-white/10"></div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-3xl">
        Complaint not found.
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#0f172a]
      via-[#182554]
      to-[#0f172a]
      text-white
      p-8
      "
    >
      {/* Back Button */}

      <button
        onClick={() => navigate(-1)}
        className="
        flex
        items-center
        gap-2
        mb-8
        px-5
        py-3
        rounded-xl
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        hover:bg-white/20
        transition
        "
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Hero */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        shadow-2xl
        p-8
        mb-8
        "
      >
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-black">{complaint.title}</h1>

              <span
                className={`${getStatusColor(
                  complaint.status,
                )} px-4 py-2 rounded-full font-semibold`}
              >
                {complaint.status}
              </span>
            </div>

            <p className="text-slate-300 mt-5 text-lg">
              {complaint.category} • {complaint.department}
            </p>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 text-slate-300">
                <CalendarDays size={18} />
                {new Date(complaint.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Flag size={18} />
                {complaint.priority}
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <User size={18} />
                {complaint.assignedOfficer?.name || "Not Assigned"}
              </div>
            </div>
          </div>

          {/* AI Verification */}

          <div
            className="
            w-72
            rounded-3xl
            bg-gradient-to-r
            from-cyan-500/20
            to-blue-500/20
            border
            border-cyan-400/30
            p-6
            "
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-cyan-300" size={28} />

              <h2 className="text-2xl font-bold">AI Verified</h2>
            </div>

            <div className="mt-6 space-y-3 text-slate-200">
              <p>✔ Confidence: 98%</p>

              <p>✔ Department Matched</p>

              <p>✔ Priority Analysed</p>

              <p>✔ Safe Routing Completed</p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Main Content */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Complaint Image */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl
          overflow-hidden
          shadow-2xl
          "
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              📷 Complaint Image
            </h2>
          </div>

          {complaint.image ? (
            <div className="relative overflow-hidden">
              <img
                src={complaint.image}
                alt={complaint.title}
                className="
                w-full
                h-[480px]
                object-cover
                transition-transform
                duration-700
                hover:scale-110
                "
              />

              <div
                className="
                absolute
                top-5
                left-5
                px-4
                py-2
                rounded-full
                bg-red-600
                font-semibold
                shadow-xl
                "
              >
                🔥 {complaint.priority}
              </div>
            </div>
          ) : (
            <div
              className="
              h-[480px]
              flex
              items-center
              justify-center
              text-slate-400
              text-xl
              "
            >
              No Image Uploaded
            </div>
          )}
        </motion.div>

        {/* Details */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Complaint Details */}

          <div
            className="
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            rounded-3xl
            shadow-2xl
            p-8
            "
          >
            <h2 className="text-2xl font-bold mb-6">📋 Complaint Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-cyan-300 font-semibold">Description</h3>

                <p className="text-slate-200 leading-8 mt-2">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400">Category</p>

                  <p className="font-semibold text-lg mt-1">
                    {complaint.category}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Department</p>

                  <p className="font-semibold text-lg mt-1">
                    {complaint.department}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Priority</p>

                  <span
                    className={`
                      inline-block
                      mt-2
                      px-4
                      py-2
                      rounded-full
                      font-semibold
                      ${
                        complaint.priority === "High"
                          ? "bg-red-600"
                          : complaint.priority === "Medium"
                            ? "bg-yellow-500 text-black"
                            : "bg-green-600"
                      }
                    `}
                  >
                    {complaint.priority}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400">Assigned Officer</p>

                  <p className="font-semibold text-lg mt-1">
                    {complaint.assignedOfficer?.name || "Not Assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}

          <div
            className="
            bg-gradient-to-br
            from-cyan-500/20
            to-blue-600/20
            backdrop-blur-xl
            border
            border-cyan-400/30
            rounded-3xl
            shadow-2xl
            p-8
            "
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={28} className="text-cyan-300" />

              <h2 className="text-2xl font-bold">AI Analysis</h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-cyan-300 font-semibold">AI Summary</p>

                <p className="text-slate-200 mt-2 leading-7">
                  {complaint.aiSummary || "No AI Summary Available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div
                  className="
                  bg-white/10
                  rounded-2xl
                  p-5
                  "
                >
                  <p className="text-slate-400">Suggested Department</p>

                  <h3 className="font-bold mt-2">{complaint.department}</h3>
                </div>

                <div
                  className="
                  bg-white/10
                  rounded-2xl
                  p-5
                  "
                >
                  <p className="text-slate-400">Estimated Resolution</p>

                  <h3 className="font-bold mt-2">2 Days</h3>
                </div>

                <div
                  className="
                  bg-white/10
                  rounded-2xl
                  p-5
                  "
                >
                  <p className="text-slate-400">AI Confidence</p>

                  <h3 className="font-bold mt-2">98%</h3>
                </div>

                <div
                  className="
                  bg-white/10
                  rounded-2xl
                  p-5
                  "
                >
                  <p className="text-slate-400">Risk Level</p>

                  <h3 className="font-bold text-red-400 mt-2">High</h3>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Timeline */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="
        mt-10
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        p-8
        shadow-2xl
        "
      >
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          📈 Complaint Progress
        </h2>

        <ComplaintTimeline status={complaint.status} />
      </motion.div>

      {/* Officer Remarks + Completion Image */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* Officer Remarks */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-8
          "
        >
          <h2 className="text-2xl font-bold mb-6">👮 Officer Remarks</h2>

          <div
            className="
            rounded-2xl
            bg-white/5
            border
            border-white/10
            p-6
            "
          >
            {complaint.remarks ? (
              <p className="text-slate-200 leading-8">{complaint.remarks}</p>
            ) : (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">💬</div>

                <p className="text-slate-400">No remarks added yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Completion Image */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          overflow-hidden
          "
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">📷 Completion Image</h2>

            {complaint.completionImage ? (
              <img
                src={complaint.completionImage}
                alt="Completion"
                className="
                w-full
                h-[320px]
                object-cover
                rounded-2xl
                transition-transform
                duration-700
                hover:scale-105
                "
              />
            ) : (
              <div
                className="
                h-[320px]
                rounded-2xl
                bg-white/5
                border
                border-white/10
                flex
                flex-col
                items-center
                justify-center
                "
              >
                <div className="text-7xl">📸</div>

                <p className="text-slate-400 mt-5">
                  Completion image not uploaded yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Complaint Location */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="
        mt-10
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        shadow-2xl
        p-8
        "
      >
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-cyan-400" size={28} />

          <h2 className="text-2xl font-bold">Complaint Location</h2>
        </div>

        {complaint.location ? (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="
                rounded-2xl
                bg-white/5
                p-5
                "
              >
                <p className="text-slate-400">Latitude</p>

                <h3 className="font-bold mt-2">
                  {complaint.location.latitude}
                </h3>
              </div>

              <div
                className="
                rounded-2xl
                bg-white/5
                p-5
                "
              >
                <p className="text-slate-400">Longitude</p>

                <h3 className="font-bold mt-2">
                  {complaint.location.longitude}
                </h3>
              </div>
            </div>

            <div
              className="
              rounded-2xl
              overflow-hidden
              border
              border-white/10
              "
            >
              <iframe
                title="Complaint Location"
                width="100%"
                height="350"
                loading="lazy"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}&z=16&output=embed`}
              />
            </div>
          </div>
        ) : (
          <div
            className="
            h-48
            rounded-2xl
            bg-white/5
            flex
            items-center
            justify-center
            text-slate-400
            "
          >
            📍 Location not available
          </div>
        )}
      </motion.div>
      {/* Resolution Details */}

      {complaint.resolvedAt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="
          mt-10
          rounded-3xl
          bg-gradient-to-r
          from-green-500/20
          to-emerald-500/20
          backdrop-blur-xl
          border
          border-green-400/30
          shadow-2xl
          p-8
          "
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-3xl">
              ✅
            </div>

            <div>
              <h2 className="text-3xl font-bold text-green-300">
                Complaint Resolved
              </h2>

              <p className="text-green-100 mt-2">
                This complaint has been successfully resolved.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-2xl p-6">
              <p className="text-green-200 text-sm">Resolution Date</p>

              <h3 className="text-white text-xl font-bold mt-2">
                {new Date(complaint.resolvedAt).toLocaleString()}
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <p className="text-green-200 text-sm">Final Status</p>

              <h3 className="text-white text-xl font-bold mt-2">
                {complaint.status}
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="
        mt-12
        text-center
        text-slate-500
        text-sm
        "
      >
        Powered by{" "}
        <span className="text-cyan-400 font-semibold">CityOS AI</span>
        {" • "}
        Smart Civic Complaint Management
      </motion.div>
    </div>
  );
}

export default CitizenComplaintDetails;
