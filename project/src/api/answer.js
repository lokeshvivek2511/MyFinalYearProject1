import axios from './axios';

export const answerAPI = {
  getAnswersByQuestion: (questionId) => axios.get(`/answers/${questionId}`),
  postAnswer: (data) => axios.post('/answers', data),
  voteAnswer: (answerId, voteType) => axios.post(`/answers/${answerId}/vote`, { voteType }),
};
