import { aiApi } from "./api";

export const aiService = {
  getAiAdvice: (payload: any) => aiApi.post("/advice", payload),
};
