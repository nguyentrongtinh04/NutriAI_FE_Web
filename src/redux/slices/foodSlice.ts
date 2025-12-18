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
  lastAction: "search" | "random" | null;
}

const initialState: FoodState = {
  list: [],
  detail: null,
  loading: false,
  loadingDetail: false,
  error: null,
  lastAction: null,
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

  export const getRandomFoods = createAsyncThunk(
    "foods/random",
    async (limit: number = 30, { rejectWithValue }) => {
      try {
        return await foodService.getRandom(limit);
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
    clearDetail(state) {
      state.detail = null;
    },
  },  
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = "search";
      })
      .addCase(searchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = "search";
        const query = action.meta.arg.toLowerCase().trim();
      
        // 1️⃣ Sort kết quả mới (ưu tiên match nhất)
        const sortedNew = [...action.payload].sort((a, b) => {
          const aName = (a.name_en || a.name || "").toLowerCase();
          const bName = (b.name_en || b.name || "").toLowerCase();
      
          if (aName === query && bName !== query) return -1;
          if (bName === query && aName !== query) return 1;
      
          if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
          if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
      
          if (aName.includes(query) && !bName.includes(query)) return -1;
          if (bName.includes(query) && !aName.includes(query)) return 1;
      
          return 0;
        });
      
        // 2️⃣ Merge với list cũ (giữ history, không trùng)
        const mergedList = [
          ...sortedNew,
          ...state.list.filter(
            oldItem =>
              !sortedNew.some(
                newItem =>
                  (newItem.name_en || newItem.name) ===
                  (oldItem.name_en || oldItem.name)
              )
          ),
        ];
      
        state.list = mergedList;
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
      })
      .addCase(getRandomFoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRandomFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.lastAction = "random";
      })
      .addCase(getRandomFoods.rejected, (state) => {
        state.loading = false;
      });
      

  },
});

export const { clearFood, clearDetail } = foodSlice.actions;
export default foodSlice.reducer;
