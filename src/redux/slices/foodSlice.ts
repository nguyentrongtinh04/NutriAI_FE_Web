import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { foodService } from "../../services/foodService";

export interface FoodItem {
    name: string;
    name_en?: string; // 🆕 thêm
    name_vi?: string; // 🆕 thêm
    brand?: string;
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    photo?: string;
    source?: string;
  }  

export interface FoodDetail extends FoodItem {
  serving_unit?: string;
  serving_weight_grams?: number;
}

interface FoodState {
  list: FoodItem[];
  detail: FoodDetail | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
}

const initialState: FoodState = {
  list: [],
  detail: null,
  loading: false,
  loadingDetail: false,
  error: null,
};

// 🔍 searchFoods
export const searchFoods = createAsyncThunk(
  "foods/search",
  async (query: string, { rejectWithValue }) => {
    try {
      return await foodService.search(query);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 📋 getFoodDetail
export const getFoodDetail = createAsyncThunk(
  "foods/detail",
  async (query: string, { rejectWithValue }) => {
    try {
      return await foodService.getDetail(query);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getFeaturedFoods = createAsyncThunk(
    "foods/featured",
    async (_, { rejectWithValue }) => {
      try {
        return await foodService.getFeatured();
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );  

const foodSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {
    clearFood(state) {
      state.detail = null;
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(searchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Detail
      .addCase(getFoodDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(getFoodDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(getFoodDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string;
      })
      .addCase(getFeaturedFoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getFeaturedFoods.rejected, (state) => {
        state.loading = false;
      });

  },
});

export const { clearFood } = foodSlice.actions;
export default foodSlice.reducer;
