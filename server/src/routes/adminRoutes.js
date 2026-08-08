import express from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficersByDepartment,
  getDashboardStats,
  getRecentComplaints,
  getAllComplaints,
  getComplaintDetails,
  getOfficers,
  reassignComplaint,
  updateOfficer,
  deleteOfficer,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================
// Dashboard
// ======================================
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

router.get("/recent-complaints", protect, adminOnly, getRecentComplaints);

// ======================================
// Complaints
// ======================================

// All complaints
router.get("/complaints", protect, adminOnly, getAllComplaints);

// Complaint Details
router.get("/complaints/:id", protect, adminOnly, getComplaintDetails);

// Assign Officer

// Reassign Officer
router.put("/reassign/:complaintId", protect, adminOnly, reassignComplaint);

// ======================================
// Officers
// ======================================

// Create Officer
router.post("/create-officer", protect, adminOnly, createOfficer);

// All Officers
router.get("/officers", protect, adminOnly, getAllOfficers);

// Officers for Dropdown
router.get("/all-officers", protect, adminOnly, getOfficers);

// Officers by Department
router.get(
  "/officers/:department",
  protect,
  adminOnly,
  getOfficersByDepartment,
);
router.put("/officers/:officerId", updateOfficer);

router.delete("/officers/:officerId", deleteOfficer);
export default router;
