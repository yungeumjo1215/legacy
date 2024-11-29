import { createSlice } from "@reduxjs/toolkit";

// 1. 초기 상태 정의
const initialState = {
  // 2. 로컬 스토리지에 저장된 데이터가 있으면 가져오고, 없으면 null(로그아웃 상태)
  authData: JSON.parse(localStorage.getItem("authData")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // 3. 기존의 authData 상태에서 action 데이터를 업데이트
      state.authData = action.payload.authData;
      // 4. 로컬 스토리징 로그인 데이터를 authData라는 키로 저장
      localStorage.setItem("authData", JSON.stringify(action.payload.authData));
    },

    logout: (state) => {
      // 5. 로그아웃 시 authData 상태를 null로 변경
      state.authData = null;
      // 6. 로컬 스토리지에 저장된 authData 삭제
      localStorage.removeItem("authData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
