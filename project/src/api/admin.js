import axios from './axios';

export const adminAPI = {
  login: (password) => axios.post('/admin/login', { password }),
  approveExpert: (userId) => axios.post(`/admin/approve-expert/${userId}`),
};
