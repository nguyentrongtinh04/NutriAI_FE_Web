import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";
export interface Provider {
  type: string;
  providerId?: string;
  passwordHash?: string;
}

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
  avt?: string;
  providers?: Provider[]; // 👈 đúng kiểu object
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
    const [userRes, authRes] = await Promise.all([
      userService.getMe(),
      // gọi auth service để lấy email, phone, role
      fetch("http://localhost:5005/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then((r) => r.json()),
    ]);

    return {
      ...userRes,
      email: authRes.email,
      phone: authRes.phone,
      role: authRes.role,
      providers: authRes.providers,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateInfo = createAsyncThunk(
  "user/updateInfo",
  async (payload: { fullname?: string; DOB?: string; gender?: "MALE" | "FEMALE" | "OTHER" }) => {
    const res = await userService.updateInfo(payload);
    return res;
  }
);

export const updateHealth = createAsyncThunk(
  "user/updateHealth",
  async (payload: { height?: string; weight?: string }) => {
    const res = await userService.updateHealth(payload);
    return res;
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (avatarUrl: string) => {
    const res = await userService.updateAvatar(avatarUrl);
    return res.user; // BE trả { message, user }
  }
);

export const uploadAndUpdateAvatar = createAsyncThunk(
  "user/uploadAndUpdateAvatar",
  async (file: File) => {
    const res = await userService.updateAndUploadAvatar(file);
    return res.user; // BE trả { message, user }
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
      })

      // Update Info
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile, // giữ lại email, phone, role...
          ...action.payload,
          providers: state.profile?.providers,
        };
      })

      // Update Health
      .addCase(updateHealth.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      })

      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      })

      // Upload + Update Avatar
      .addCase(uploadAndUpdateAvatar.fulfilled, (state, action) => {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
