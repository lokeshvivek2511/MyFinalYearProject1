import axios from './axios';

export const translateAPI = {
  translate: (text, language) => axios.post('/translate', { text, language }),
};
