import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatbot from "./components/chatbot/Chatbot";
import EventSchedule from "./components/Event_schedule";
import Header from "./components/Header";
import Search from "./components/Search";
import Login from "./user/Login";
import Mypage from "./user/Mypage";
import Signup from "./user/Signup";
import Event from "./components/Event";
import LocalStorageViewer from "./components/Localstorageviewer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "./redux/slices/authSlice";
import Sample from "./components/chatbot/Sample";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      // 토큰이 있으면 자동으로 로그인 상태 복원
      dispatch(loginUser({ token, user }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/search" element={<Search />} />
          <Route path="/event_schedule" element={<EventSchedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/event" element={<Event />} />
          <Route path="/local" element={<LocalStorageViewer />} />
          <Route path="/sample" element={<Sample />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
