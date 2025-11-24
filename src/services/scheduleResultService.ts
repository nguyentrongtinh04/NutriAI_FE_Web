import { scheduleResultApi } from "./api";

export const scheduleResultService = {
  
  // 🟢 Tạo đánh giá kết quả lịch
  submit: async (scheduleId: string, payload: any) =>
    (await scheduleResultApi.post(`/submit/${scheduleId}`, payload)).data,

  // 🔍 Kiểm tra user đã đánh giá lịch này chưa
  check: async (scheduleId: string) =>
    (await scheduleResultApi.post(`/by-schedule`, { scheduleId })).data,

  // 📋 Lấy tất cả đánh giá của user
  list: async () =>
    (await scheduleResultApi.get(`/my-results`)).data,

  // 🔍 Lấy chi tiết một đánh giá
  detail: async (id: string) =>
    (await scheduleResultApi.get(`/${id}`)).data,
};
