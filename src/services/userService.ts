import axios from "axios";

const IP_USER = "http://localhost:5001/user";

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

  // Cập nhật thông tin cơ bản (fullname, DOB, gender)
  updateInfo: async (payload: {
    fullname?: string;
    DOB?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
  }) => {
    const res = await userApi.put("/update-info", payload);
    return res.data;
  },

  // Cập nhật thông tin sức khỏe (height, weight)
  updateHealth: async (payload: {
    height?: string;
    weight?: string;
  }) => {
    const res = await userApi.put("/update-health", payload);
    return res.data;
  },

  // Đổi avatar
  updateAvatar: async (avatarUrl: string) => {
    // BE của bạn là PATCH /update-avatar với body { avt: url }
    const res = await userApi.patch("/update-avatar", { avt: avatarUrl });
    return res.data;
  },

  // Đổi avatar (upload file → Cloudinary → update DB)
  updateAndUploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // dùng PATCH /update-avatar (đúng route BE)
    const res = await userApi.patch("/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { message, user }
  },

};
