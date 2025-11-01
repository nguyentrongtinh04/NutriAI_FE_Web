import axios from "axios";

const MEAL_API = "http://localhost:5002/meals-scand";

export const mealService = {
  // Gửi ảnh lên BE để AI phân tích
  analyzeMeal: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
  
    const res = await axios.post(`${MEAL_API}/analyze`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  saveScannedMeal: async (data: any) => {
    const res = await axios.post(`${MEAL_API}/save`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },  
  
  getScannedHistory: async () => {
    const res = await axios.get(`${MEAL_API}/history`);
    return res.data;
  },

  async getRecentScannedMeals() {
    try {
      const res = await axios.get(`${MEAL_API}/recent`);
      return res.data.meals; // [{ name, time, nutrition }]
    } catch (error: any) {
      console.error("❌ planService.getRecentScannedMeals error:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách món ăn gần nhất");
    }
  },
  
};
