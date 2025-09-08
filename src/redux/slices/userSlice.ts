import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../lib/http";

interface User {
  _id?: string;
  authId?: string;
  fullname: string;
  gender: string;
  DOB: string | null;
  height?: number;
  weight?: number;
}

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

// ===== Thunks =====

// Lấy user hiện tại từ BE (/users/me)
export const fetchMe = createAsyncThunk("user/fetchMe", async (_, thunkAPI) => {
  try {
    const { data } = await userApi.get<User>("/me");
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch me failed");
  }
});

// Lấy danh sách user
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, thunkAPI) => {
  try {
    const { data } = await userApi.get<User[]>("/");
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch users failed");
  }
});

// Tạo user mới
export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload: Omit<User, "_id" | "authId">, thunkAPI) => {
    try {
      const { data } = await userApi.post<User>("/", payload);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Create user failed");
    }
  }
);

// Lấy chi tiết 1 user
export const fetchUserById = createAsyncThunk("user/fetchUserById", async (id: string, thunkAPI) => {
  try {
    const { data } = await userApi.get<User>(`/${id}`);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch user failed");
  }
});

// Xóa user
export const deleteUser = createAsyncThunk("user/deleteUser", async (id: string, thunkAPI) => {
  try {
    await userApi.delete(`/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Delete user failed");
  }
});

// ===== Slice =====
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createUser
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.currentUser = action.payload;
      })

      // fetchUserById
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
