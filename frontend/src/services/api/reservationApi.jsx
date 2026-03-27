import apiClient from './apiClient';

const reservationApi = {
  create: (data) => apiClient.post('/reservations', data),
  getMyReservations: () => apiClient.get('/reservations/my-reservations'),
  cancel: (id) => apiClient.patch(`/reservations/${id}/cancel`),
  checkAvailability: (params) => apiClient.get('/reservations/check-availability', { params }),
};

export default reservationApi;