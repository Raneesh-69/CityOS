import { Link } from "react-router-dom";
import { CalendarDays, Building2, Flag, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

function ComplaintCard({ complaint, children }) {
  return (
    <div
      className="
      bg-white/10
      backdrop-blur-xl
      border
      border-white/20
      rounded-3xl
      overflow-hidden
      shadow-2xl
      hover:shadow-cyan-500/20
      hover:-translate-y-2
      transition-all
      duration-300
      "
    >
      {/* Image */}

      {complaint.image ? (
        <div className="relative h-72 overflow-hidden">
          <img
            src={complaint.image}
            alt={complaint.title}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              hover:scale-110
            "
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          <div className="absolute top-4 right-4">
            <StatusBadge status={complaint.status} />
          </div>

          <div className="absolute bottom-4 left-4">
            <span
              className={`
              px-4 py-2 rounded-full text-sm font-semibold
              ${
                complaint.priority === "High"
                  ? "bg-red-600 text-white"
                  : complaint.priority === "Medium"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-600 text-white"
              }
            `}
            >
              {complaint.priority} Priority
            </span>
          </div>
        </div>
      ) : (
        <div
          className="
          h-72
          flex
          items-center
          justify-center
          bg-slate-800
          text-slate-400
          text-lg
        "
        >
          📷 No Image Available
        </div>
      )}

      {/* Content */}

      <div className="p-7">
        <div className="flex justify-between items-start gap-5">
          <div>
            <h2 className="text-3xl font-bold text-white">{complaint.title}</h2>

            <p className="text-slate-300 mt-3 leading-7">
              {complaint.description}
            </p>
          </div>

          {!complaint.image && <StatusBadge status={complaint.status} />}
        </div>

        {/* Info */}

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="flex items-center gap-3 text-slate-300">
            <Building2 size={18} className="text-cyan-400" />
            <span>{complaint.department}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Flag size={18} className="text-yellow-400" />
            <span>{complaint.category}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <CalendarDays size={18} className="text-green-400" />
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            👮
            <span>{complaint.assignedOfficer?.name || "Not Assigned"}</span>
          </div>
        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to={`/officer/complaints/${complaint._id}`}
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-semibold
              hover:scale-105
              transition
            "
          >
            View Details
            <ArrowRight size={18} />
          </Link>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default ComplaintCard;
