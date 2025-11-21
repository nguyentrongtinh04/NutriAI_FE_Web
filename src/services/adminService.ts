import { adminApi, authAdminApi, authApi } from "./api";

export const adminService = {
  // ✔ Lấy danh sách admin (call sang BE router mới)
    createAdmin: async (payload: any) =>
      (await authApi.post("/admin-register", payload)).data,
  
    getAdmins: async () =>
      (await adminApi.get("/admins")).data,
  
    deleteAdmin: async (id: string) =>
      (await authAdminApi.delete(`/admin/${id}`)).data,

  getAllServicesStats: async () =>
    (await adminApi.get("/stats-all-services")).data,

  getRequestLogsStats: async () =>
    (await adminApi.get("/stats-log")).data,
};
