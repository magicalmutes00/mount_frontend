import api from "./axios";

// Get active announcements (public)
export const getActiveAnnouncements = () => {
  return api.get("/announcements/public");
};

// Get all announcements (admin)
export const getAllAnnouncements = () => {
  return api.get("/announcements/admin");
};

// Create announcement (admin)
export const createAnnouncement = (data) => {
  return api.post("/announcements/admin", data);
};

// Update announcement (admin)
export const updateAnnouncement = (id, data) => {
  return api.put(`/announcements/admin/${id}`, data);
};

// Delete announcement (admin)
export const deleteAnnouncement = (id) => {
  return api.delete(`/announcements/admin/${id}`);
};

// Toggle active status (admin)
export const toggleAnnouncementActive = (id) => {
  return api.patch(`/announcements/admin/${id}/toggle-active`);
};