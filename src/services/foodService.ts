import { foodApi } from "./api";

export const foodService = {
  search: async (query: string) =>
    (await foodApi.get(`/food/search?query=${encodeURIComponent(query)}`)).data,

  getDetail: async (query: string) =>
    (await foodApi.get(`/food/detail?query=${encodeURIComponent(query)}`)).data,

  getFeatured: async () =>
    (await foodApi.get(`/food/featured`)).data,

  getRandom: async (limit = 30) =>
    (await foodApi.get(`/food/random?limit=${limit}`)).data,
  getSavedFoods: async (userId: string) => 
    (await foodApi.get(`/food/listSave/${userId}`)).data,

};
