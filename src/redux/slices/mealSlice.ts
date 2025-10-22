import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mealService } from "../../services/mealService";

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealState {
  loading: boolean;
  result: {
    food_en: string;
    food_vi: string;
    confidence: number;
    nutrition?: Nutrition;
    image_url?: string; 
    example?: any;
  } | null;
  error: string | null;
}

const initialState: MealState = {
  loading: false,
  result: null,
  error: null,
};

// 🧠 Thunk gọi BE
export const analyzeMeal = createAsyncThunk(
  "meal/analyze",
  async (file: File, { rejectWithValue }) => {
    try {
      return await mealService.analyzeMeal(file);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    clearMeal: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(analyzeMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMeal } = mealSlice.actions;
export default mealSlice.reducer;
