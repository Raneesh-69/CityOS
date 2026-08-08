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
// =====================================
// CITIZEN MANAGEMENT
// =====================================

// Get All Citizens
export const getAllCitizens = async (req, res) => {
  try {
    const citizens = await User.find({
      role: "citizen",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const citizensWithComplaintCount = await Promise.all(
      citizens.map(async (citizen) => {
        const complaintCount = await Complaint.countDocuments({
          user: citizen._id,
        });

        return {
          ...citizen.toObject(),
          complaintCount,
        };
      }),
    );

    res.status(200).json(citizensWithComplaintCount);
  } catch (error) {
    console.error("Failed to get citizens:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Create Citizen
// =====================================

export const createCitizen = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const citizenExists = await User.findOne({ email });

    if (citizenExists) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const citizen = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "citizen",
      department: "",
    });

    const citizenResponse = citizen.toObject();

    delete citizenResponse.password;

    res.status(201).json({
      message: "Citizen created successfully.",
      citizen: citizenResponse,
    });
  } catch (error) {
    console.error("Failed to create citizen:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Update Citizen
// =====================================

export const updateCitizen = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const { name, email, phone } = req.body;

    const citizen = await User.findById(citizenId);

    if (!citizen || citizen.role !== "citizen") {
      return res.status(404).json({
        message: "Citizen not found.",
      });
    }

    // Prevent duplicate email
    if (email && email !== citizen.email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: citizenId },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Another account already uses this email.",
        });
      }
    }

    citizen.name = name;
    citizen.email = email;
    citizen.phone = phone;

    await citizen.save();

    const citizenResponse = citizen.toObject();

    delete citizenResponse.password;

    res.status(200).json({
      message: "Citizen updated successfully.",
      citizen: citizenResponse,
    });
  } catch (error) {
    console.error("Failed to update citizen:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Delete Citizen
// =====================================

export const deleteCitizen = async (req, res) => {
  try {
    const { citizenId } = req.params;

    const citizen = await User.findById(citizenId);

    if (!citizen || citizen.role !== "citizen") {
      return res.status(404).json({
        message: "Citizen not found.",
      });
    }

    await User.findByIdAndDelete(citizenId);

    res.status(200).json({
      message: "Citizen deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete citizen:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// Update Citizen Status
// =====================================

export const updateCitizenStatus = async (req, res) => {
  try {
    const { citizenId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid citizen status.",
      });
    }

    const citizen = await User.findById(citizenId);

    if (!citizen || citizen.role !== "citizen") {
      return res.status(404).json({
        message: "Citizen not found.",
      });
    }

    citizen.accountStatus = status;

    await citizen.save();

    res.status(200).json({
      message: `Citizen account ${status}.`,
      citizen: {
        _id: citizen._id,
        name: citizen.name,
        email: citizen.email,
        phone: citizen.phone,
        role: citizen.role,
        accountStatus: citizen.accountStatus,
      },
    });
  } catch (error) {
    console.error("Failed to update citizen status:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
