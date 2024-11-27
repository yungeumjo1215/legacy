import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import Event_schedule from "./components/Event_schedule";
import Header from "./components/Header";
import Search from "./components/Search";
import Signup from "./signup/Signup";
import Login from "./login/Login";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/search" element={<Search />} />
          <Route path="/event_schedule" element={<Event_schedule />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
