import axios from 'axios';

// Konfigurasi instance Axios dengan alamat server backend Express.js kamu
const api = axios.create({
    baseURL: 'http://localhost:3000/api' 
});

// Otomatis menempelkan token JWT ke Header jika token tersedia di local storage (Pertemuan 7)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('orion_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const apiService = {
    get: (url) => api.get(url),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),

    // User Library actions
    borrowBook: (id) => api.post(`/books/${id}/borrow`),
    returnBook: (id) => api.post(`/books/${id}/return`),
    saveBook: (id) => api.post(`/books/${id}/save`),
    unsaveBook: (id) => api.delete(`/books/${id}/save`),
    getUserLibrary: () => api.get('/user/library')
};

export default api;