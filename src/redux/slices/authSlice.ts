import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string | null;
  role: string;
  emailVerified: boolean;
  isSuperAdmin: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;   // ✅ BẮT BUỘC
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  user: null,  // ✅ BẮT BUỘC
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string ; user: User }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.status = "succeeded";
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;   
      state.status = "idle";
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAuth, clearAuth, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
