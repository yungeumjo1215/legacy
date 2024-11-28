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

const apiSlices = createSlice({
  name: "apis",
  getHeritageData: null,

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
