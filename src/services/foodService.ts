import axios from "axios";

const API_BASE = "http://localhost:5007/foods"; // BE endpoint

export const foodService = {
  async search(query: string) {
    const res = await axios.get(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    return res.data; // ✅ backend giờ trả list thẳng
  },

  async getDetail(query: string) {
    const res = await axios.get(`${API_BASE}/detail?query=${encodeURIComponent(query)}`);
    return res.data;
  },

  async getFeatured() { // 🆕
    const res = await axios.get(`${API_BASE}/featured`);
    return res.data;
  },
};

