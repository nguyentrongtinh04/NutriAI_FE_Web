import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import mealReducer from "./slices/mealSlice";
import foodReducer from "./slices/foodSlice";
import planReducer from "./slices/planSlice";
import systemStatsReducer from "./slices/systemStatsSlice";
import aiReducer from "./slices/aiSlice";
import aiFoodReducer from "./slices/aiFoodSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  meal: mealReducer,
  food: foodReducer,
  plan: planReducer,
  system: systemStatsReducer,
  ai: aiReducer,
  aiFood: aiFoodReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type CleanRootState = {
  [K in keyof RootState]: RootState[K];
};
export type AppDispatch = typeof store.dispatch;

