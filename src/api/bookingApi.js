import { apiClient } from './apiClient'
import { asArray } from '../utils/collections'

export async function createBooking({ numberOfSeats, seatNumbers, showId }) {
  const { data } = await apiClient.post('/api/booking/create_booking', {
    numberOfSeats,
    seatNumbers,
    showId,
  })
  return data
}

export async function getMyBookings() {
  const { data } = await apiClient.get('/api/booking/my_bookings')
  return asArray(data)
}

export async function getBookingsForShow(showId) {
  const { data } = await apiClient.get(`/api/booking/get_bookings_for_show/${showId}`)
  return asArray(data)
}

export async function confirmBooking(bookingId) {
  const { data } = await apiClient.put(`/api/booking/confirm_booking/${bookingId}`)
  return data
}

export async function cancelBooking(bookingId) {
  const { data } = await apiClient.put(`/api/booking/cancel_booking/${bookingId}`)
  return data
}

export async function getBookingsByStatus(bookingStatus) {
  const { data } = await apiClient.get(`/api/booking/get_bookings_by_status/${bookingStatus}`)
  return asArray(data)
}
