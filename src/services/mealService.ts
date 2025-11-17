import { mealApi } from "./api";

export const mealService = {
  analyzeMeal: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return (
      await mealApi.post("/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },
  saveScannedMeal: async (data: any) => (await mealApi.post("/save", data)).data,
  getScannedHistory: async (userId: string) =>
    (await mealApi.get("/history", { params: { userId } })).data,
  getRecentMeals: async (userId: string) =>
    (await mealApi.get("/recent", { params: { userId } })).data,
};
