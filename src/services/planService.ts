import axios from "axios";

const API_URL_AI = "http://localhost:5003/Ai-schedule"; // ✅ BE endpoint
const API_URL_Schedule = "http://localhost:5003/schedule"; // ✅ BE endpoint

export const planService = {
  async generatePlan(userInfo: any) {
    try {
      const response = await axios.post(`${API_URL_AI}/generate-plan-2step`, userInfo, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // { step, userInfo, nutrition, mealPlan }
    } catch (error: any) {
      console.error("❌ mealService.generatePlan error:", error);
      throw new Error(error.response?.data?.error || "Không thể tạo kế hoạch ăn uống");
    }
  },

  async generateNutrition(userInfo: any) {
    return axios.post(`${API_URL_AI}/generate-nutrition`, userInfo, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async generateMealPlan(userInfo: any, nutrition: any) {
    return axios.post(`${API_URL_AI}/generate-meal-plan`, { userInfo, nutrition }, {
      headers: { "Content-Type": "application/json" },
    });
  },

  // 🆕 Lấy danh sách lịch trình của user
  async getUserSchedules(token: string) {
    try {
      const res = await axios.get(`${API_URL_Schedule}/get-me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("⚠️ Người dùng chưa có lịch trình nào");
        return { schedules: [] }; // 👉 Trả về mảng rỗng thay vì throw
      }
      console.error("❌ planService.getUserSchedules error:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy danh sách lịch trình");
    }
  },

  // 🆕 Lấy chi tiết 1 lịch trình (nếu cần sau này)
  async getFullSchedule(id: string, token: string) {
    try {
      const res = await axios.get(`${API_URL_Schedule}/get-schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      console.error("❌ planService.getFullSchedule error:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy chi tiết lịch trình");
    }
  },
  // 🆕 Tạo lịch trình mới (lưu vào DB)
  async createFullSchedule(scheduleData: any, token: string) {
    try {
      // ⚙️ Map mealType đúng với enum BE ["sáng", "phụ sáng", "trưa", "chiều", "tối"]
      const normalizedSchedule = {
        ...scheduleData,
        schedule: scheduleData.schedule.map((day: any) => ({
          ...day,
          meals: day.meals.map((meal: any) => ({
            ...meal,
            mealType:
              meal.mealType?.toLowerCase().includes("phụ") ? "phụ sáng" :
              meal.mealType?.toLowerCase().includes("sáng") ? "sáng" :
              meal.mealType?.toLowerCase().includes("trưa") ? "trưa" :
              meal.mealType?.toLowerCase().includes("chiều") ? "chiều" :
              meal.mealType?.toLowerCase().includes("tối") ? "tối" :
              "khác",
          })),
        })),
      };
  
      const res = await axios.post(
        `${API_URL_Schedule}/create-schedule`,
        normalizedSchedule,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return res.data;
    } catch (error: any) {
      console.error("❌ planService.createFullSchedule error:", error);
      throw new Error(error.response?.data?.message || "Không thể tạo lịch trình");
    }
  },  

  // 🆕 Lấy bữa ăn tiếp theo trong lịch trình đang active
  async getNextMeal(token: string) {
    try {
      const res = await axios.get(`${API_URL_Schedule}/next-meal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // { message, meal, scheduleInfo, ... }
    } catch (error: any) {
      console.error("❌ planService.getNextMeal error:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy bữa ăn kế tiếp");
    }
  },

};

