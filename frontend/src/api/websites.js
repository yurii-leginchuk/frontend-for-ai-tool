import api from "../services/api";

export const createWebsite = (data) => api.post("/websites/create", data);
export const getWebsites = () => api.get("/websites");
export const getWebsiteById = (id) => api.get(`/websites/${id}`);
export const updateWebsite = (id, data) => api.put(`/websites/${id}`, data);
export const deleteWebsite = (id) => api.delete(`/websites/${id}`);
