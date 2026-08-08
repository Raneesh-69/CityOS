import api from "./api";

// Get all complaints of logged-in citizen
export const getMyComplaints = async () => {
  const { data } = await api.get("/complaints/my");
  return data;
};

// Get single complaint details
export const getMyComplaintDetails = async (id) => {
  const { data } = await api.get(`/complaints/my/${id}`);
  return data;
};
