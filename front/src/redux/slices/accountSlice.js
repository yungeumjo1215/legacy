import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 서버와 통신하는 비동기 작업 정의
export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/account/create", accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/account/delete/${uuid}`);
      return uuid; // 성공 시 삭제된 계정 UUID를 반환
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 초기 상태 정의
const initialState = {
  accounts: [], // 계정 리스트
  loading: false,
  error: null,
};

// slice 정의
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createAccount 관련 리듀서
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload); // 생성된 계정을 추가
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteAccount 관련 리듀서
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(
          (account) => account.uuid !== action.payload
        ); // UUID로 계정을 필터링하여 삭제
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// slice의 reducer를 export
export default accountSlice.reducer;
