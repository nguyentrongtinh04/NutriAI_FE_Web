import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminService } from "../../services/adminService";

interface SystemState {
  serviceStats: any | null;
  requestLogs: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: SystemState = {
  serviceStats: null,
  requestLogs: null,
  loading: false,
  error: null,
};

// 🟢 Thống kê từ tất cả service
export const fetchAllServiceStats = createAsyncThunk(
  "system/fetchAllServiceStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllServicesStats();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🟢 Log thống kê request
export const fetchRequestLogsStats = createAsyncThunk(
  "system/fetchRequestLogsStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getRequestLogsStats();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const systemStatsSlice = createSlice({
  name: "system",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ========== All Service Stats ==========
      .addCase(fetchAllServiceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllServiceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceStats = action.payload;
        state.error = null;
      })
      .addCase(fetchAllServiceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ========== Request Logs Stats ==========
      .addCase(fetchRequestLogsStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestLogsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.requestLogs = action.payload;
        state.error = null;
      })
      .addCase(fetchRequestLogsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default systemStatsSlice.reducer;
