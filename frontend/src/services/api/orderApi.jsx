import apiClient from './apiClient';

const orderApi = {
  create: (orderData) => apiClient.post('/orders', orderData),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  cancel: (id) => apiClient.patch(`/orders/${id}/cancel`),
};

export default orderApi;