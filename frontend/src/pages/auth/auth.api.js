import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API = `${API_BASE}/auth`;

export const login = (email, password) => axios.post(`${API}/login`, { email, password });
export const register = (email, password) => axios.post(`${API}/register`, { email, password });
