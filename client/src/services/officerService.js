import api from "./api";

// Get all complaints assigned to the logged-in officer
export const getAssignedComplaints = async () => {
  const { data } = await api.get("/complaints/officer/assigned");
  return data;
};

// Get single complaint details
export const getComplaintDetails = async (id) => {
  const { data } = await api.get(`/complaints/${id}`);
  return data;
};

// Update complaint status, remarks and completion image
export const updateOfficerComplaint = async (id, formData) => {
  const { data } = await api.put(`/complaints/officer/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
