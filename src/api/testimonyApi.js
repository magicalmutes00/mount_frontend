import api from "./axios";

// Create testimony (public)
export const createTestimony = (data) => {
  return api.post("/testimonies", data);
};

// Get approved testimonies (public)
export const getApprovedTestimonies = () => {
  return api.get("/testimonies/approved");
};

// Get all testimonies (admin)
export const getAllTestimonies = () => {
  return api.get("/testimonies/admin");
};

// Get pending testimonies (admin)
export const getPendingTestimonies = () => {
  return api.get("/testimonies/pending");
};

// Approve or reject testimony (admin)
export const updateTestimonyStatus = (id, status) => {
  return api.put(`/testimonies/${id}`, { status });
};

// Delete testimony (admin)
export const deleteTestimony = (id) => {
  return api.delete(`/testimonies/${id}`);
};
