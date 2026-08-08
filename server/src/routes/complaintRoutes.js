import express from "express";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  getAssignedComplaints,
  getMyComplaints,
  getMyComplaintDetails,
  updateComplaintStatus,
  updateOfficerComplaint,
} from "../controllers/complaintController.js";

import upload from "../middleware/uploadMiddleware.js";
import { protect, officerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// Citizen Routes
// =====================================

// Create Complaint
router.post("/", protect, upload.single("image"), createComplaint);

// My Complaints
router.get("/my", protect, getMyComplaints);

// My Complaint Details
router.get("/my/:id", protect, getMyComplaintDetails);

// =====================================
// Officer Routes
// =====================================

// Assigned Complaints
router.get("/officer/assigned", protect, officerOnly, getAssignedComplaints);

// Update Complaint
router.put(
  "/officer/update/:complaintId",
  protect,
  officerOnly,
  upload.single("image"),
  updateOfficerComplaint,
);

// =====================================
// Public/Admin Routes
// =====================================

// Get All Complaints
router.get("/", getComplaints);

// Get Complaint By ID
router.get("/:id", getComplaintById);

// Admin Update Status
router.put("/:id/status", updateComplaintStatus);

export default router;
