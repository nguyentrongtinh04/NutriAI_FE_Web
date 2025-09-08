import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../lib/http";
import { saveTokens, clearTokens, AuthTokens } from "../../lib/auth";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// ==== REGISTER ====
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { phone: string; email: string; password: string; fullName?: string }, thunkAPI) => {
    try {
      const { data } = await authApi.post<AuthTokens>("/register", payload);
      saveTokens(data);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

// ==== LOGIN ====
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { phoneOrEmail: string; password: string }, thunkAPI) => {
    try {
      const { data } = await authApi.post<AuthTokens>("/login", payload);
      saveTokens(data);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ==== GOOGLE LOGIN ====
export const loginWithGoogle = createAsyncThunk("auth/google", async (id_token: string, thunkAPI) => {
  try {
    const { data } = await authApi.post<AuthTokens>("/google", { id_token });
    saveTokens(data);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Google login failed");
  }
});

// ==== LOGOUT ====
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  clearTokens();
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
