import { combineReducers, configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slices/apiSlices";

const store = configureStore({
  reducer: combineReducers({
    apis: apiReducer, // 값은 만드는 이름
  }),
});

export default store;
