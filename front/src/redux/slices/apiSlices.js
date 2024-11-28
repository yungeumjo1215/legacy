import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../utils/requestMethods";
import { GET_HERITAGE_API_URL } from "../../utils/apiUrl";

const getHeritageFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (userId) => {
    // console.log(apiURL, userId);
    const fullPatth = `${apiURL}/${userId}`;
    // console.log(fullPatth);
    return await getRequest(fullPatth);
  });
};

// get items data
export const fetchGetHeritageData = getHeritageFetchThunk(
  "fetcHgetHeritage", //action type
  GET_HERITAGE_API_URL // 요청 url
); // thunk 함수 호출

// handleFulfilled 함수 정의 : 요청 성공 시 상태 업데이트 로직을 별도의 함수로 분리
const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload; // action.payload에 응답 데이터가 들어있음
};

// handleRejected 함수 정의 : 요청 실패 시 상태 업데이트 로직을 별도의 함수로 분리
const handleRejected = (state, action) => {
  console.log("Error", action.payload);
  state.isError = true;
};

const apiSlices = createSlice({
  name: "apis",
  initialState: { getHeritageData: null },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchGetHeritageData.fulfilled,
        handleFulfilled("getHeritageData")
      )
      .addCase(fetchGetHeritageData.rejected, handleRejected);
  },
});

export default apiSlices.reducer;
