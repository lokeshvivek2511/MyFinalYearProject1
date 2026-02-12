import axios from './axios';

export const schemeAPI = {
  getEligibleSchemes: (data) => axios.post('/schemes/eligible', data),
};
