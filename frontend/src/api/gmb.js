import api from "../services/api";

export const createGmb = (data) => api.post("/gmb/create", data);
export const getGmb = () => api.get("/gmb");
export const getGmbById = (id) => api.get(`/gmb/${id}`);
export const updateGmb = (id, data) => api.put(`/gmb/${id}`, data);
export const deleteGmb = (id) => api.delete(`/gmb/${id}`);
