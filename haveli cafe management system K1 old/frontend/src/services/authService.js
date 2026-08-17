import api from "./api";

export const loginUser = (payload) => api.post("/auth/login", payload);
export const loginAdmin = (payload) => api.post("/auth/login/admin", payload);
export const loginStaff = (payload) => api.post("/auth/login/staff", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const registerAdmin = (payload) => api.post("/auth/register/admin", payload);
export const registerStaff = (payload) => api.post("/auth/register/staff", payload);
export const sendOtp = (payload) => api.post("/auth/send-otp", payload);
export const verifyOtp = (payload) => api.post("/auth/verify-otp", payload);
export const resetPassword = (payload) => api.post("/auth/reset-password", payload);
export const fetchProfile = () => api.get("/auth/profile");
