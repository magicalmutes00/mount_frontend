import api from "./axios";

// Subscribe to email notifications
export const subscribeToNotifications = (subscriptionData) => {
  return api.post("/email-subscriptions", subscriptionData);
};

// Unsubscribe from email notifications
export const unsubscribeFromNotifications = (email, token) => {
  return api.post("/email-subscriptions/unsubscribe", { email, token });
};

// Update subscription preferences
export const updateSubscriptionPreferences = (id, preferences) => {
  return api.put(`/email-subscriptions/${id}`, preferences);
};

// Admin: Get all subscribers
export const getAllSubscribers = () => {
  return api.get("/admin/email-subscriptions");
};

// Admin: Get subscriber by ID
export const getSubscriberById = (id) => {
  return api.get(`/admin/email-subscriptions/${id}`);
};

// Admin: Update subscriber status
export const updateSubscriberStatus = (id, status) => {
  return api.put(`/admin/email-subscriptions/${id}/status`, { is_active: status });
};

// Admin: Delete subscriber
export const deleteSubscriber = (id) => {
  return api.delete(`/admin/email-subscriptions/${id}`);
};

// Admin: Send email to subscribers
export const sendEmailToSubscribers = (emailData) => {
  return api.post("/admin/email-subscriptions/send", emailData);
};

// Admin: Get email templates
export const getEmailTemplates = () => {
  return api.get("/admin/email-templates");
};

// Admin: Create email template
export const createEmailTemplate = (templateData) => {
  return api.post("/admin/email-templates", templateData);
};

// Admin: Update email template
export const updateEmailTemplate = (id, templateData) => {
  return api.put(`/admin/email-templates/${id}`, templateData);
};

// Admin: Delete email template
export const deleteEmailTemplate = (id) => {
  return api.delete(`/admin/email-templates/${id}`);
};

// Admin: Send notification for live stream
export const sendLiveStreamNotification = (streamData) => {
  return api.post("/admin/email-subscriptions/notify-live-stream", streamData);
};

// Admin: Send notification for scheduled stream
export const sendScheduledStreamNotification = (streamData) => {
  return api.post("/admin/email-subscriptions/notify-scheduled-stream", streamData);
};

// Admin: Get subscription statistics
export const getSubscriptionStats = () => {
  return api.get("/admin/email-subscriptions/stats");
};