import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { analyzeComplaint } from "../services/aiService.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
export const createComplaint = async (req, res) => {
  try {
    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
    }

    // Parse location
    let location = null;

    if (req.body.location) {
      location = JSON.parse(req.body.location);
    }

    // AI Analysis
    const aiResult = await analyzeComplaint(
      `Title: ${req.body.title}

Description: ${req.body.description}`,
    );

    console.log("AI Result:", aiResult);
    console.log("AI Department:", aiResult.department);

    const officer = await User.findOne({
      role: "officer",
      department: aiResult.department,
    });

    console.log("Officer Found:", officer);

    console.log("AI Result:", aiResult);

    // Create complaint
    const complaint = await Complaint.create({
      // Replace this with req.user._id once authentication middleware is used
      user: req.user._id, // Placeholder for the authenticated user's ID

      title: req.body.title,
      description: req.body.description,

      category: aiResult.category,
      department: aiResult.department,
      priority: aiResult.priority,
      aiSummary: aiResult.summary,

      assignedOfficer: officer ? officer._id : null,

      status: officer ? "Assigned" : "Pending",

      location,
      image: imageUrl,
    });

    // Populate officer details before sending response
    await complaint.populate("assignedOfficer", "name email department");

    res.status(201).json({
      message: officer
        ? "Complaint Created & Officer Assigned Successfully"
        : "Complaint Created Successfully (No matching officer found)",

      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getComplaintById = async (req, res) => {
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
// ===============================
// Update Complaint Status (Admin)
// ===============================
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (remarks) {
      complaint.remarks = remarks;
    }

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Assigned Complaints (Officer)
// ===============================
export const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedOfficer: req.user._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Officer Update Complaint
// ===============================
export const updateOfficerComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, remarks } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      !complaint.assignedOfficer ||
      complaint.assignedOfficer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not assigned to this complaint.",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (remarks) {
      complaint.remarks = remarks;
    }

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      complaint.completionImage = uploadedImage.secure_url;
    }

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Citizen - Get My Complaints
// ===============================
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id,
    })
      .populate("assignedOfficer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Citizen - Get My Complaint Details
// ===============================
export const getMyComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("assignedOfficer", "name email phone");

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
