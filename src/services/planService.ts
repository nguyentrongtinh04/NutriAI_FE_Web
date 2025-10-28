import axios from "axios";

const API_URL = "http://localhost:5000"; // ✅ BE endpoint

export const planService = {
  async generatePlan(userInfo: any) {
    try {
      const response = await axios.post(`${API_URL}/generate-plan-2step`, userInfo, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // { step, userInfo, nutrition, mealPlan }
    } catch (error: any) {
      console.error("❌ mealService.generatePlan error:", error);
      throw new Error(error.response?.data?.error || "Không thể tạo kế hoạch ăn uống");
    }
  },

  async generateNutrition(userInfo: any) {
    return axios.post(`${API_URL}/generate-nutrition`, userInfo, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async generateMealPlan(userInfo: any, nutrition: any) {
    return axios.post(`${API_URL}/generate-meal-plan`, { userInfo, nutrition }, {
      headers: { "Content-Type": "application/json" },
    });
  },
};

