import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to all requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default {
    // Auth
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    
    // Items
    getItems: () => api.get('/items'),
    getItemsByRole: (role) => api.get(`/items/role/${role}`),
    
    // Requests
    submitRequest: (data) => api.post('/requests/submit', data),
    getMyRequests: () => api.get('/requests/my'),
    getAllRequests: () => api.get('/requests'),
    updateRequestStatus: (id, data) => api.put(`/requests/${id}/status`, data)
};
