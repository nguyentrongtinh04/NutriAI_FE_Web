import { scheduleResultApi } from "./api";

export const scheduleResultService = {
  // 🟢 Tạo đánh giá
  submit: async (scheduleId: string, payload: any) =>
    (await scheduleResultApi.post(`/submit/${scheduleId}`, payload)).data,

  // 🔍 Kiểm tra user đã đánh giá chưa
  check: async (scheduleId: string) =>
    (await scheduleResultApi.post(`/by-schedule`, { scheduleId })).data,

  // 📋 Lấy danh sách đánh giá
  list: async () =>
    (await scheduleResultApi.get(`/my-results`)).data,

  // 🔍 Lấy chi tiết
  detail: async (id: string) =>
    (await scheduleResultApi.get(`/${id}`)).data,
};
console.log("👉 FULL URL:", scheduleResultApi.defaults.baseURL + "/by-schedule");

