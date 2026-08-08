import api from "./api";

// Dashboard Statistics
export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard-stats");
  return data;
};

// Recent Complaints
export const getRecentComplaints = async () => {
  const { data } = await api.get("/admin/recent-complaints");
  return data;
};

// All Complaints
export const getAllComplaints = async () => {
  const { data } = await api.get("/admin/complaints");
  return data;
};

// Single Complaint Details
export const getComplaintDetails = async (id) => {
  const { data } = await api.get(`/admin/complaints/${id}`);
  return data;
};

// All Officers
export const getAllOfficers = async () => {
  const { data } = await api.get("/admin/officers");
  return data;
};

// Officers for dropdown
export const getOfficers = async () => {
  const { data } = await api.get("/admin/all-officers");
  return data;
};

// Create Officer
export const createOfficer = async (officerData) => {
  const { data } = await api.post("/admin/create-officer", officerData);
  return data;
};

// Assign / Reassign Officer
export const reassignComplaint = async (complaintId, officerId) => {
  const { data } = await api.put(`/admin/reassign/${complaintId}`, {
    officerId,
  });

  return data;
};

// Update Officer
export const updateOfficer = async (officerId, officerData) => {
  const { data } = await api.put(`/admin/officers/${officerId}`, officerData);

  return data;
};

// Delete Officer
export const deleteOfficer = async (officerId) => {
  const { data } = await api.delete(`/admin/officers/${officerId}`);

  return data;
};
