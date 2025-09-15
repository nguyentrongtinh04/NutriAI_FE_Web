import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  emailVerified?: boolean;   // 👈 thêm flag
  status?: string;
  error?: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  emailVerified: false,
  status: "idle",
  error: null,
};

// gửi mã xác thực
export const sendEmailVerification = createAsyncThunk(
  "auth/sendEmailVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.sendEmailVerification(email);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// xác minh email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(email, code);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// gửi mã đổi email
export const requestEmailChange = createAsyncThunk(
  "auth/requestEmailChange",
  async ({ oldEmail, newEmail }: { oldEmail: string; newEmail: string }, { rejectWithValue }) => {
    try {
      return await authService.requestEmailChange(oldEmail, newEmail);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// xác nhận đổi email
export const confirmEmailChange = createAsyncThunk(
  "auth/confirmEmailChange",
  async ({ oldEmail, code }: { oldEmail: string; code: string }, { rejectWithValue }) => {
    try {
      return await authService.confirmEmailChange(oldEmail, code);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.emailVerified = false;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.emailVerified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
  
      // 👉 update email
      .addCase(requestEmailChange.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(confirmEmailChange.fulfilled, (state) => {
        state.status = "succeeded";
        state.emailVerified = false; // ✅ vì email mới cần verify lại
      })
      .addCase(confirmEmailChange.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  }  
});

export const { setAuth, clearAuth, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
