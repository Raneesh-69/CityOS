import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";

// =====================================
// Create Officer
// =====================================
export const createOfficer = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    const officerExists = await User.findOne({ email });

    if (officerExists) {
      return res.status(400).json({
        message: "Officer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      role: "officer",
    });

    res.status(201).json({
      message: "Officer created successfully",
      officer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// Get All Officers with Complaint Count
// =====================================
export const getAllOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      role: "officer",
    }).select("-password");

    const officersWithCounts = await Promise.all(
      officers.map(async (officer) => {
        const assignedCount = await Complaint.countDocuments({
          assignedOfficer: officer._id,
          status: { $ne: "Resolved" },
        });

        return {
          ...officer.toObject(),
          assignedCount,
        };
      }),
    );

    res.status(200).json(officersWithCounts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// Update Officer
// =====================================
export const updateOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const { name, email, phone, department } = req.body;

    const officer = await User.findById(officerId);

    if (!officer || officer.role !== "officer") {
      return res.status(404).json({
        message: "Officer not found",
      });
    }

    officer.name = name;
    officer.email = email;
    officer.phone = phone;
    officer.department = department;

    await officer.save();

    res.status(200).json({
      message: "Officer updated successfully",
      officer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// Delete Officer
// =====================================
export const deleteOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;

    const officer = await User.findById(officerId);

    if (!officer || officer.role !== "officer") {
      return res.status(404).json({
        message: "Officer not found",
      });
    }

    await User.findByIdAndDelete(officerId);

    res.status(200).json({
      message: "Officer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// Get Officers by Department
// =====================================
export const getOfficersByDepartment = async (req, res) => {
  try {
    const officers = await User.find({
      role: "officer",
      department: req.params.department,
    }).select("-password");

    res.status(200).json(officers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Get Officers (Dropdown)
// =====================================
export const getOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      role: "officer",
    }).select("name email department");

    res.status(200).json(officers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Dashboard Statistics
// =====================================
export const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const assigned = await Complaint.countDocuments({
      status: "Assigned",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const totalOfficers = await User.countDocuments({
      role: "officer",
    });

    const departments = await User.distinct("department", {
      role: "officer",
    });

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalComplaints,
      pending,
      assigned,
      inProgress,
      resolved,
      totalOfficers,
      departments: departments.length,
      recentComplaints,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Recent Complaints
// =====================================
export const getRecentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedOfficer", "name department")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =====================================
// Get All Complaints
// =====================================
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email phone")
      .populate("assignedOfficer", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Get Complaint Details
// =====================================
export const getComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedOfficer", "name email department");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Assign / Reassign Officer
// =====================================
export const reassignComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { officerId } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const officer = await User.findById(officerId);

    if (!officer || officer.role !== "officer") {
      return res.status(404).json({
        message: "Officer not found",
      });
    }

    // Assign Officer
    complaint.assignedOfficer = officer._id;

    // Update department to match officer
    complaint.department = officer.department;

    // If complaint has not yet started,
    // move it to Assigned status.
    if (complaint.status === "Pending" || complaint.status === "") {
      complaint.status = "Assigned";
    }

    await complaint.save();

    await complaint.populate("assignedOfficer", "name email department");

    res.status(200).json({
      success: true,
      message: "Officer assigned successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
