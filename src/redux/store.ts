import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage cho web
import { combineReducers } from "redux";
import userReducer from "../redux/slices/userSlice";
import authReducer from "../redux/slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage, // thay cho AsyncStorage
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;