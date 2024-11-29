import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlices";
import modalReducer from "./slices/modalSlice";
import heritageReducer from "./slices/heritageDetailSlice";
import festivalReducer from "./slices/festivalDetailSlice";
import accountReducer from "./slices/accountSlice";

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer, // 값은 만드는 이름
    account: accountReducer,
    apis: apiReducer,
    modal: modalReducer,
    heritage: heritageReducer,
    festival: festivalReducer,
  }),
});

export default store;
