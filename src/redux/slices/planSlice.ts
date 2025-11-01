import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planService } from "../../services/planService";

interface PlanState {
  mealPlan: any | null;
  schedules: any[];
  nextMeal: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  mealPlan: null,
  schedules: [],
  nextMeal: null,
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

// 🧠 Lấy danh sách lịch trình người dùng
export const fetchSchedulesThunk = createAsyncThunk(
  "plan/fetchSchedules",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await planService.getUserSchedules(token);
      return data.schedules;
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi tải danh sách lịch trình");
    }
  }
);

// 🧠 Tạo lịch trình ăn uống và lưu vào DB
export const createScheduleThunk = createAsyncThunk(
  "plan/createSchedule",
  async ({ scheduleData, token }: { scheduleData: any; token: string }, { rejectWithValue }) => {
    try {
      const data = await planService.createFullSchedule(scheduleData, token);
      return data.schedule; // trả về lịch vừa tạo
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi tạo lịch trình");
    }
  }
);

// 🕒 Lấy bữa ăn kế tiếp trong lịch trình hiện tại
export const fetchNextMealThunk = createAsyncThunk(
  "plan/fetchNextMeal",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await planService.getNextMeal(token);
      return data; // trả full dữ liệu từ BE
    } catch (err: any) {
      return rejectWithValue(err.message || "Lỗi khi lấy bữa ăn kế tiếp");
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
      })
      .addCase(fetchSchedulesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedulesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createScheduleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createScheduleThunk.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Thêm lịch mới vào đầu danh sách
        state.schedules = [action.payload, ...state.schedules];
      })
      .addCase(createScheduleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNextMealThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextMealThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.nextMeal = action.payload;
      })
      .addCase(fetchNextMealThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPlan } = planSlice.actions;
export default planSlice.reducer;
