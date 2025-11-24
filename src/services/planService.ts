import { planApi, aiApi } from "./api";

export const planService = {
  // ========================
  // 🔹 AI GENERATION
  // ========================

  generatePlan: async (userInfo: any) =>
    (await aiApi.post("/generate-plan-2step", userInfo)).data,

  generateNutrition: async (userInfo: any) =>
    (await aiApi.post("/generate-nutrition", userInfo)).data,

  generateMealPlan: async (userInfo: any, nutrition: any) =>
    (await aiApi.post("/generate-meal-plan", { userInfo, nutrition })).data,

  // ========================
  // 🔹 USER SCHEDULE CRUD
  // ========================

  getUserSchedules: async () =>
    (await planApi.get("/get-me")).data,

  getFullSchedule: async (id: string) =>
    (await planApi.get(`/get-schedule/${id}`)).data,

  createFullSchedule: async (scheduleData: any) =>
    (await planApi.post("/create-schedule", scheduleData)).data,

  getNextMeal: async () =>
    (await planApi.get("/next-meal")).data,

  enrichSchedule: async (scheduleData: any) =>
    (await planApi.post("/prepare-schedule", scheduleData)).data,


  // ========================
  // 🔹 Optional: Sharing
  // ========================

  shareSchedule: async (scheduleId: string, targetUserId: string) =>
    (await planApi.post(`/share/${scheduleId}`, { targetUserId })).data,

  acceptShare: async (shareId: string) =>
    (await planApi.post(`/accept-share`, { shareId })).data,
};
