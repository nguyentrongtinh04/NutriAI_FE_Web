import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aiFoodService } from "../../services/aiFoodService";

/* =======================
   Payload type
======================= */
export interface AnalyzeFoodsBatchPayload {
  medicalConditions: string[];
  foods: {
    name: string;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
}

/* =======================
   State type
======================= */
interface AiFoodState {
  warnings: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AiFoodState = {
  warnings: null,
  loading: false,
  error: null,
};

/* =======================
   Thunk (GIỐNG getAiAdviceThunk)
======================= */
export const analyzeFoodsBatch = createAsyncThunk<
  any,                         // return type
  AnalyzeFoodsBatchPayload     // payload type
>(
  "aiFood/analyzeFoodsBatch",
  async (payload, { rejectWithValue }) => {
    try {
      return await aiFoodService.analyzeFoodsBatch(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "AI food analyze failed");
    }
  }
);

/* =======================
   Slice
======================= */
const aiFoodSlice = createSlice({
  name: "aiFood",
  initialState,
  reducers: {
    clearFoodWarnings(state) {
      state.warnings = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeFoodsBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeFoodsBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.warnings = action.payload;
      })
      .addCase(analyzeFoodsBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFoodWarnings } = aiFoodSlice.actions;
export default aiFoodSlice.reducer;
