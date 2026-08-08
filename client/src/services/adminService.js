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
// ==========================================
// CITIZEN MANAGEMENT
// ==========================================

// Get all citizens
export const getAllCitizens = async () => {
  const { data } = await api.get("/admin/citizens");
  return data;
};

// Create citizen
export const createCitizen = async (citizenData) => {
  const { data } = await api.post("/admin/create-citizen", citizenData);
  return data;
};

// Update citizen
export const updateCitizen = async (citizenId, citizenData) => {
  const { data } = await api.put(`/admin/citizens/${citizenId}`, citizenData);
  return data;
};

// Delete citizen
export const deleteCitizen = async (citizenId) => {
  const { data } = await api.delete(`/admin/citizens/${citizenId}`);
  return data;
};

// Activate / deactivate citizen
export const updateCitizenStatus = async (citizenId, status) => {
  const { data } = await api.patch(`/admin/citizens/${citizenId}/status`, {
    status,
  });
  return data;
};
