import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      // 토큰이 있지만 로그인 상태가 아닐 경우
      try {
        // 토큰 검증 로직 추가 가능
        dispatch(
          loginSuccess({
            token,
            user: JSON.parse(localStorage.getItem("user")),
          })
        );
      } catch (error) {
        console.error("Auth Error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
      }
    }
  }, [dispatch, isLoggedIn]);

  return { isLoggedIn, user };
};
