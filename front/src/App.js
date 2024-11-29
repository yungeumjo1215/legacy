import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import EventSchedule from "./components/Event_schedule";
import Header from "./components/Header";
import Search from "./components/Search";
import Login from "./user/Login";
import Mypage from "./user/Mypage";
import Signup from "./user/Signup";
import ComTest from "./components/Comtest";
import FestivalTable from "./components/FestivalTable";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ComTest" element={<ComTest />} />
          <Route path="/FestivalTable" element={<FestivalTable />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/search" element={<Search />} />
          <Route path="/event_schedule" element={<EventSchedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
