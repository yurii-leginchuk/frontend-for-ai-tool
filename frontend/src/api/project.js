import api from "../services/api";

export const createProject = (data) => api.post("/projects/create", data);
export const getProjects = () => api.get("/projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
