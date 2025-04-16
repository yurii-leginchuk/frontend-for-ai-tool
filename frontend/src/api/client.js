import api from "../services/api";

export const createClient = (data) => api.post("/clients/create", data);
export const getClients = () => api.get("/clients");
export const getClientById = (id) => api.get(`/clients/${id}`);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
