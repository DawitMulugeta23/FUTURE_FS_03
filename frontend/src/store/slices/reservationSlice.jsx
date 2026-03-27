import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reservationApi from '../../services/api/reservationApi';
import toast from 'react-hot-toast';

const initialState = {
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
};

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await reservationApi.create(reservationData);
      toast.success('Reservation made successfully!');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMyReservations = createAsyncThunk(
  'reservations/fetchMyReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reservationApi.getMyReservations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await reservationApi.cancel(id);
      toast.success('Reservation cancelled');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async (params, { rejectWithValue }) => {
    try {
      const response = await reservationApi.checkAvailability(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReservation = action.payload.data;
        state.reservations.unshift(action.payload.data);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchMyReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = action.payload.data;
      })
      .addCase(fetchMyReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r._id === action.payload.data._id);
        if (index !== -1) {
          state.reservations[index] = action.payload.data;
        }
      });
  },
});

export const { clearCurrentReservation } = reservationSlice.actions;
export default reservationSlice.reducer;