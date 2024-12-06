import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlices";
import modalReducer from "./slices/modalSlice";
import heritageReducer from "./slices/heritageDetailSlice";
import festivalReducer from "./slices/festivalDetailSlice";
import accountReducer from "./slices/accountSlice";
import eventReducer from "./slices/eventSlice";
import favoriteReducer from "./slices/favoriteSlice";
import syncLocalStorageMiddleware from "./sendLocalStorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    apis: apiReducer,
    modal: modalReducer,
    heritage: heritageReducer,
    festival: festivalReducer,
    event: eventReducer,
    favorites: favoriteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncLocalStorageMiddleware),
}); //  문자열 합치면서 localstorage 보내는 redux 추가

export default store;
