import { userApi } from "./api";

export const userService = {
  getMe: async () => (await userApi.get("/me")).data,
  updateInfo: async (payload: any) => (await userApi.put("/update-info", payload)).data,
  updateHealth: async (payload: any) => (await userApi.put("/update-health", payload)).data,
  updateAvatar: async (avatarUrl: string) =>
    (await userApi.patch("/update-avatar", { avt: avatarUrl })).data,
  updateAndUploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    return (await userApi.patch("/update-avatar", formData)).data;
  },
};
