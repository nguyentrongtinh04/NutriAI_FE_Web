import { aiFoodApi } from "./api";

export const aiFoodService = {
  analyzeFoodsBatch: async (payload: {
    medicalConditions: string[];
    foods: {
      name: string;
      nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    }[];
  }) => {
    return (
      await aiFoodApi.post("/food/foods-analyze-batch", payload)
    ).data;
  },
};
