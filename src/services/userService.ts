import { userApi } from "./api";

export const userService = {

  // 🔹 Lấy thông tin user hiện tại
  getMe: async () =>
    (await userApi.get("/me")).data,

  // 🔹 Cập nhật thông tin cá nhân
  updateInfo: async (payload: any) =>
    (await userApi.put("/update-info", payload)).data,

  // 🔹 Cập nhật thông tin sức khỏe
  updateHealth: async (payload: any) =>
    (await userApi.put("/update-health", payload)).data,

  // 🔹 Cập nhật avatar bằng URL
  updateAvatar: async (avatarUrl: string) =>
    (await userApi.patch("/update-avatar", { avt: avatarUrl })).data,

  // 🔹 Upload file avatar (multipart/form-data)
  updateAndUploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return (
      await userApi.patch("/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },
};
