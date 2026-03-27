import apiClient from './apiClient';

const menuApi = {
  getAll: (params) => apiClient.get('/menu', { params }),
  getById: (id) => apiClient.get(`/menu/${id}`),
  getByCategory: (category) => apiClient.get(`/menu/category/${category}`),
  getSpecials: () => apiClient.get('/menu/specials'),
};

export default menuApi;