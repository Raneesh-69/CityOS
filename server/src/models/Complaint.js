import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // Citizen who created the complaint
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Officer assigned by Admin
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Complaint Details
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // GPS Location
    location: {
      latitude: Number,
      longitude: Number,
    },

    // Complaint Status
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },

    // Priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    aiSummary: {
      type: String,
      default: "",
    },
    // AI Classification
    aiCategory: {
      type: String,
      default: "",
    },

    // Officer Remarks
    remarks: {
      type: String,
      default: "",
    },

    // Completion Photo uploaded by Officer
    completionImage: {
      type: String,
      default: "",
    },

    // Complaint Resolution Time
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Complaint", complaintSchema);
