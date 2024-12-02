import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlices";
import modalReducer from "./slices/modalSlice";
import heritageReducer from "./slices/heritageDetailSlice";
import festivalReducer from "./slices/festivalDetailSlice";
import accountReducer from "./slices/accountSlice";
import eventReducer from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    apis: apiReducer,
    modal: modalReducer,
    heritage: heritageReducer,
    festival: festivalReducer,
    event: eventReducer,
  },
});

export default store;
