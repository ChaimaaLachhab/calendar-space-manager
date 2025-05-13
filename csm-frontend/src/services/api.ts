
import axios from 'axios';

// Get the API URL from environment variables or use a default
const API_URL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    axiosInstance.post('/auth/login', { email, password }),
  
  signup: (fullName: string, email: string, password: string) =>
    axiosInstance.post('/auth/signup', { fullName, email, password }),
  
  getProfile: () => axiosInstance.get('/users/me'),
  
  updateProfile: (profileData: any) => axiosInstance.put('/users/me', profileData)
};

// Spaces APIs
export const spacesAPI = {
  getAll: (filters?: any) => axiosInstance.get('/spaces', { params: filters }),
  
  getById: (id: string) => axiosInstance.get(`/spaces/${id}`),
  
  create: (spaceData: FormData) => 
    axiosInstance.post('/spaces', spaceData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  update: (id: string, spaceData: FormData) =>
    axiosInstance.put(`/spaces/${id}`, spaceData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  delete: (id: string) => axiosInstance.delete(`/spaces/${id}`)
};

// Reservations APIs
export const reservationsAPI = {
  create: (reservationData: any) => axiosInstance.post('/reservations', reservationData),

  getAll: () => axiosInstance.get('/reservations/all'),

  getReservedDatesBySpaceId: (spaceId: string) => axiosInstance.get(`/reservations/reserved-dates/${spaceId}`),

  getUserReservations: () => axiosInstance.get('/reservations/my'),
  
  cancel: (id: string) => axiosInstance.delete(`/reservations/${id}`)
};

// Contact APIs
export const contactAPI = {
  send: (contactData: any) => axiosInstance.post('/contacts', contactData),
  
  getAll: () => axiosInstance.get('/contacts'),
  
  respond: (id: string, response: string) => 
    axiosInstance.put(`/contacts/${id}`, { response, status: 'answered' })
};

export default axiosInstance;
