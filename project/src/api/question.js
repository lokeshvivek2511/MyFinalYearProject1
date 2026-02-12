import axios from './axios';

export const questionAPI = {
  getQuestions: () => axios.get('/questions'),
  askQuestion: (data) => axios.post('/questions', data),
};
