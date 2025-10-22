import axios from "axios";

const MEAL_API = "http://localhost:5007/meals";

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
  
};
