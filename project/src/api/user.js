import axios from './axios';

export const userAPI = {
  getProfile: () => axios.get('/users/me'),
  updateProfile: (data) => axios.put('/users/me', data),
};
