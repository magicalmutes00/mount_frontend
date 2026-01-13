import api from "./axios";

// Create prayer
export const createPrayer = (data) => {
  return api.post("/prayers", data);
};

// Get all prayers (admin)
export const getAllPrayers = () => {
  return api.get("/prayers");
};

// Delete prayer
export const deletePrayer = (id) => {
  return api.delete(`/prayers/${id}`);
};
