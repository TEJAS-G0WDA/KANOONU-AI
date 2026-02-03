import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const askQuestion = async (question, language = 'english') => {
  try {
    const response = await api.post('/ask', {
      question,
      language,
    });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};

// Case Law Search API
export const searchCaseLaw = async (query) => {
  try {
    const response = await api.post('/case-law-search', {
      query,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching case law:', error);
    throw error;
  }
};

// Admin Login API
export const adminLogin = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  
  const response = await axios.post(`${API_BASE_URL}/admin/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true,
    maxRedirects: 5,
    validateStatus: (status) => status >= 200 && status < 500,
  });
  return response;
};

export default api;

