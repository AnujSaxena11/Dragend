import axios from "axios";

const BASE_API = import.meta.env.VITE_BACKEND_BASE_API;

const api = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
});

export const getProfile       = ()         => api.get("/auth/profile");
export const getProjects      = ()         => api.get("/project");
export const checkUsername    = (username) => api.get("/auth/check-username", { params: { username } });
export const updateProfile    = (data)     => api.put("/auth/update", data);
export const getPublicProfile = (username) => api.get(`/auth/profile/${username}`);