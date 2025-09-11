import axios from "axios";
const IP_USER ="http://localhost:5001/user";

const userApi = axios.create({
  baseURL: IP_USER,
  timeout: 10000,
});
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Lấy thông tin user hiện tại
  getMe: async () => {
    const res = await userApi.get("/me");
    return res.data;
  },

  // Cập nhật thông tin người dùng
  updateProfile: async (payload: {
    fullname?: string;
    DOB?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    height?: string;
    weight?: string;
    BMI?: string;

    activityLevel?: number;
  }) => {
    const res = await userApi.put("/update-info", payload);
    return res.data;
  },

  // Đổi avatar
  updateAvatar: async (avatarUrl: string) => {
    const res = await userApi.put("/avatar", { avatar: avatarUrl });
    return res.data;
  },
};
