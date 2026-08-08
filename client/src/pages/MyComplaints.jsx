import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock } from "lucide-react";
import { getMyComplaints } from "../services/citizenService";
import PageContainer from "../components/ui/PageContainer";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.title.toLowerCase().includes(search.toLowerCase()),
  );
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;

  const assignedCount = complaints.filter(
    (c) => c.status === "Assigned",
  ).length;

  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved",
  ).length;
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";

      case "Assigned":
        return "bg-blue-500";

      case "In Progress":
        return "bg-cyan-500";

      case "Resolved":
        return "bg-green-500";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <PageContainer>
      {/* Hero */}

      <div className="mb-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-5xl font-black text-white">📋 My Complaints</h1>

          <p className="text-slate-300 mt-3 text-lg">
            Track every complaint and monitor its progress in real time.
          </p>
        </div>
      </div>

      {/* Search */}

      <div className="mb-8 relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-14
            p-4
            rounded-2xl
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            text-white
            placeholder:text-slate-400
            outline-none
            focus:ring-4
            focus:ring-cyan-400/30
          "
        />
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {/* Total */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-slate-300">Total</p>
          <h2 className="text-4xl font-black text-white">
            {complaints.length}
          </h2>
        </div>

        {/* Pending */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-slate-300">Pending</p>
          <h2 className="text-4xl font-black text-yellow-400">
            {pendingCount}
          </h2>
        </div>

        {/* Assigned */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-slate-300">Assigned</p>
          <h2 className="text-4xl font-black text-blue-400">{assignedCount}</h2>
        </div>

        {/* In Progress */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-slate-300">In Progress</p>
          <h2 className="text-4xl font-black text-cyan-400">
            {inProgressCount}
          </h2>
        </div>

        {/* Resolved */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <p className="text-slate-300">Resolved</p>
          <h2 className="text-4xl font-black text-green-400">
            {resolvedCount}
          </h2>
        </div>
      </div>

      {/* Empty */}

      {filteredComplaints.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center">
          <h2 className="text-3xl font-bold text-white">No Complaints Found</h2>

          <p className="text-slate-300 mt-4">
            Report your first civic issue to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/complaints/${complaint._id}`}
                className="
                block
                bg-white/10
                backdrop-blur-xl
                border
                border-white/20
                rounded-3xl
                overflow-hidden
                hover:scale-[1.02]
                hover:shadow-2xl
                transition-all
                duration-300
                "
              >
                {complaint.image && (
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="w-full h-72 object-cover"
                  />
                )}

                <div className="p-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">
                      {complaint.title}
                    </h2>

                    <span
                      className={`${getStatusColor(
                        complaint.status,
                      )} px-4 py-2 rounded-full text-white text-sm font-semibold`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="text-slate-300 mt-5 leading-8">
                    {complaint.description}
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <div>
                      <p className="text-cyan-300 font-semibold">Department</p>

                      <p className="text-slate-300">
                        {complaint.department || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-cyan-300 font-semibold">Priority</p>

                      <p className="text-slate-300">
                        {complaint.priority || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-cyan-300 font-semibold">Category</p>

                      <p className="text-slate-300">{complaint.category}</p>
                    </div>

                    <div>
                      <p className="text-cyan-300 font-semibold">Officer</p>

                      <p className="text-slate-300">
                        {complaint.assignedOfficer?.name || "Not Assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-8 text-slate-400">
                    <Clock size={18} />

                    <span>
                      {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default MyComplaints;
