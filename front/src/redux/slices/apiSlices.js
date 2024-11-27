import { createSlice } from "@reduxjs/toolkit";

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
  "fetchgetHeritage", //action type
  GET_TASKS_API_URL // 요청 url
); // thunk 함수 호출

const apiSlices = createSlice({
  name: "apis",
  getHeritageData: null,
});

export default apiSlices.reducer;
