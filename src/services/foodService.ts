import { foodApi } from "./api";

export const foodService = {
  search: async (query: string) =>
    (await foodApi.get(`/search?query=${encodeURIComponent(query)}`)).data,
  getDetail: async (query: string) =>
    (await foodApi.get(`/detail?query=${encodeURIComponent(query)}`)).data,
  getFeatured: async () => (await foodApi.get("/featured")).data,
  getRandom: async (limit = 30) =>
    (await foodApi.get(`/random?limit=${limit}`)).data,
};
