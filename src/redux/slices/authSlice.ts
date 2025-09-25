import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  status?: string;
  error?: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
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

// check phone/email
export const checkAvailability = createAsyncThunk(
  "auth/checkAvailability",
  async ({ phone, email }: { phone?: string; email?: string }, { rejectWithValue }) => {
    try {
      return await authService.checkAvailability(phone, email);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// link Google
export const linkGoogle = createAsyncThunk(
  "auth/linkGoogle",
  async (idToken: string, { rejectWithValue }) => {
    try {
      return await authService.linkGoogle(idToken);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// link Phone
export const linkPhone = createAsyncThunk(
  "auth/linkPhone",
  async ({ phone, password }: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      return await authService.linkPhone(phone, password);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const requestUnlink = createAsyncThunk(
  "auth/requestUnlink",
  async (type: "google" | "phone", { rejectWithValue }) => {
    try {
      return await authService.requestUnlink(type);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const confirmUnlink = createAsyncThunk(
  "auth/confirmUnlink",
  async ({ type, code }: { type: "google" | "phone"; code: string }, { rejectWithValue }) => {
    try {
      return await authService.confirmUnlink(type, code);
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
      })
      .addCase(confirmEmailChange.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  }
});

export const { setAuth, clearAuth, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
