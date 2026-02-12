import axios from './axios';

export const cropAPI = {
  recommendCrop: (data) => axios.post('/crop/recommend', data),
};
