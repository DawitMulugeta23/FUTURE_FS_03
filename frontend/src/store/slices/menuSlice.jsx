import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuApi from '../../services/api/menuApi';

const initialState = {
  items: [],
  specials: [],
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await menuApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchSpecials = createAsyncThunk(
  'menu/fetchSpecials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await menuApi.getSpecials();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSpecials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSpecials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specials = action.payload.data;
      })
      .addCase(fetchSpecials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;