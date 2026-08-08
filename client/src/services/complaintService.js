import api from "./api";

export const createComplaint = async (formData) => {
  const { data } = await api.post("/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getComplaints = async () => {
  const { data } = await api.get("/complaints");
  return data;
};
export const updateComplaintStatus = async (id, status, remarks) => {
  const { data } = await api.put(`/complaints/${id}/status`, {
    status,
    remarks,
  });

  return data;
};
