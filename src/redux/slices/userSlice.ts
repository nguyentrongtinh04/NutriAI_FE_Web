import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";

export interface User {
  id?: string;
  authId?: string;
  fullname?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  DOB?: string;
  height?: string;
  weight?: string;
  BMI?: string;
  activityLevel?: number;
  email?: string;
  phone?: string;
  avt?: string; // 👈 avatar
}

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// ====== Thunks ======
export const fetchMe = createAsyncThunk("user/fetchMe", async (_, thunkAPI) => {
  try {
    const data = await userService.getMe();
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    payload: {
      fullname?: string;
      DOB?: string;
      gender?: "MALE" | "FEMALE" | "OTHER";
      height?: string;
      weight?: string;
      BMI?: string;
      activityLevel?: number;
    },
    thunkAPI
  ) => {
    try {
      const data = await userService.updateProfile(payload);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (avatarUrl: string, thunkAPI) => {
    try {
      const data = await userService.updateAvatar(avatarUrl);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ====== Slice ======
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMe
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateProfile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // updateAvatar
    builder
      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avt = action.payload.avt || action.payload.avatar || action.payload.url;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
