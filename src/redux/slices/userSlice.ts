import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  avt?: string; // đổi thành avt cho khớp backend
}

interface UserState {
  profile: User | null;
}

const initialState: UserState = {
  profile: null,
};

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
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
