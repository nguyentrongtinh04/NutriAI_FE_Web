import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {planService} from "../../services/planService";

interface PlanState {
  mealPlan: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  mealPlan: null,
  loading: false,
  error: null,
};

// 🧠 Gọi API 2-step để sinh meal plan
export const generatePlanThunk = createAsyncThunk(
  "plan/generatePlan",
  async (userInfo: any, { rejectWithValue }) => {
    try {
      const res = await planService.generatePlan(userInfo);
      return res.data?.mealPlan || res.mealPlan; 
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi tạo kế hoạch ăn uống");
    }
  }
);

export const generateNutritionThunk = createAsyncThunk(
  "plan/generateNutrition",
  async (userInfo: any, { rejectWithValue }) => {
    try {
      const res = await planService.generateNutrition(userInfo);
      return res.data.nutrition; // chỉ lấy nutrition
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi tính dinh dưỡng");
    }
  }
);

export const generateMealPlanThunk = createAsyncThunk(
  "plan/generateMealPlan",
  async ({ userInfo, nutrition }: any, { rejectWithValue }) => {
    try {
      const res = await planService.generateMealPlan(userInfo, nutrition);
      return res.data; // meal plan object
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi tạo meal plan");
    }
  }
);


const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    resetPlan(state) {
      state.mealPlan = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePlanThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePlanThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlan = action.payload;
      })
      .addCase(generatePlanThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateMealPlanThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateMealPlanThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlan = action.payload; // ✅ lưu mealPlan vào Redux
      })
      .addCase(generateMealPlanThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPlan } = planSlice.actions;
export default planSlice.reducer;
