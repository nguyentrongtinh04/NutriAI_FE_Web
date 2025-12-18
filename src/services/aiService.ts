import { aiApi } from "./api";

export const aiService = {
  getAiAdvice: (payload: any) => aiApi.post("/advice", payload),
  checkMealForDisease: (payload: any) =>
    aiApi.post("/check-meal-disease", payload),
};
