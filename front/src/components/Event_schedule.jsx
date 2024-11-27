import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { areaLink } from "../constans/data";

const Event_schedule = () => {
  const [date, setDate] = useState(new Date()); // 선택된 날짜를 상태로 관리
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const [search, setSearch] = useState(""); // 검색창 상태 관리
  // 검색어 변경 시 실행될 함수
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  // 검색 버튼 클릭 시 실행될 함수 (예시)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("검색어:", search);
    // 실제 검색 로직 수행 (API 호출 등)
  };
  return (
    <div className="w-full h-auto fixed mt-10" style={{ paddingTop: "4rem" }}>
      <div className="container">
        <h1 className="font-semibold text-5xl pb-5">행사 정보</h1>
      </div>
      <div className="MC w-full h-auto flex justify-between border-2 rounded-md">
        <div className="search">
          <form onSubmit={handleSubmit} className="flex m-5 w-full h-auto">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={handleChange}
              className="Event-sc rounded-s-[5px]"
            />
            <button
              type="submit"
              className="border bg-blue-800 text-white rounded-e-[5px] px-2"
            >
              검색
            </button>
          </form>
        </div>
        <div className="btn flex  items-center pl-10">
          <ul className="w-full flex flex-wrap gap-5 pl-10">
            <span className="font-semibold text-2xl">위치:</span>
            {areaLink.map((item, idx) => (
              <li key={idx} className="mr-10">
                <button
                  to={item.to}
                  className={`border hover:bg-blue-800 hover:text-white border-slate-500 rounded-md p-1 font-semibold px-3 ${
                    item.label === "경상" ? "Gyeongsang" : ""
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="pl-10 flex-grow-0 flex-shrink-0">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="Event">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default Event_schedule;
