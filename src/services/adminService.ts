import { adminApi, authApi } from "./api";

export const adminService = {

  createAdmin: async (payload: any) =>
    (await authApi.post("/admin-register", payload)).data,

  getAdmins: async () =>
    (await adminApi.get("/admins")).data,

  deleteAdmin: async (id: string) =>
    (await adminApi.delete(`/deleteAD/${id}`)).data,

  getAllServicesStats: async () =>
    (await adminApi.get("/stats-all-services")).data,

  getRequestLogsStats: async () =>
    (await adminApi.get("/stats-log")).data,
};
