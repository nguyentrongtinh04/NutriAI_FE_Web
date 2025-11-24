import { mealApi } from "./api";

export const mealService = {
  // Upload ảnh + phân tích
  analyzeMeal: async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    return (
      await mealApi.post("/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  // Lưu bữa ăn đã quét
  saveScannedMeal: async (data: any) =>
    (await mealApi.post("/save", data)).data,

  // Lịch sử bữa ăn đã quét
  getScannedHistory: async (userId: string) =>
    (await mealApi.get("/history", { params: { userId } })).data,

  // Bữa ăn gần đây
  getRecentMeals: async (userId: string) =>
    (await mealApi.get("/recent", { params: { userId } })).data,

  // OPTIONAL: Thống kê global
  getGlobalStats: async () =>
    (await mealApi.get("/stats")).data
};
