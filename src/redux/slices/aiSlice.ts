import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aiService } from "../../services/aiService";

interface AiState {
  advice: any | null;
  diseaseCheck: any | null; // ✅ NEW
  loading: boolean;
  error: string | null;
}

const initialState: AiState = {
  advice: null,
  diseaseCheck: null,
  loading: false,
  error: null,
};

export const getAiAdviceThunk = createAsyncThunk(
  "ai/getAdvice",
  async ({ userId, userInfo, userSchedule }: any, { rejectWithValue }) => {
    try {
      // ⚙️ Gộp userId vào userInfo
      const payload = {
        userInfo: { ...userInfo, userId }, // 🔥 quan trọng nhất
        userSchedule,
      };

      console.log("📤 Payload gửi lên AI:", JSON.stringify(payload, null, 2));

      const res = await aiService.getAiAdvice(payload);
      return res.data;
    } catch (err: any) {
      console.error("❌ Lỗi gọi AI:", err);
      return rejectWithValue(err.message || "Không thể lấy lời khuyên AI");
    }
  }
);

export const checkMealForDiseaseThunk = createAsyncThunk(
  "ai/checkMealForDisease",
  async (
    { diseases, durationDays, mealPlan }: any,
    { rejectWithValue }
  ) => {
    try {
      const res = await aiService.checkMealForDisease({
        diseases,
        durationDays,
        mealPlan,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Disease analysis failed"
      );
    }
  }
);


const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAdvice(state) {
      state.advice = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAiAdviceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAiAdviceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.advice = action.payload;
      })
      .addCase(getAiAdviceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkMealForDiseaseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkMealForDiseaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.diseaseCheck = action.payload;
      })
      .addCase(checkMealForDiseaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdvice } = aiSlice.actions;
export default aiSlice.reducer;
