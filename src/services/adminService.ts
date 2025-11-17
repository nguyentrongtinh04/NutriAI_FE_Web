// services/adminService.ts
import { adminApi } from "./api";

export const adminService = {
  // 🆕 Thêm hai API thống kê
  getAllServicesStats: async () =>
    (await adminApi.get("/stats-all-services")).data,

  getRequestLogsStats: async () =>
    (await adminApi.get("/stats-log")).data,
};
