import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { areaLink } from "../constans/data";

const Event_schedule = () => {
  const [date, setDate] = useState(new Date()); // 선택된 날짜를 상태로 관리
  const [events, setEvents] = useState([]); // API에서 가져온 데이터를 저장
  const [search, setSearch] = useState(""); // 검색창 상태 관리
  console.log(events);
  //날짜 선택 시 실행되는 함수
  const handleDateChange = async (newDate) => {
    setDate(newDate);

    //날짜를 적절한 형식으로 변환
    const formattedDate = newDate.toISOString().split("T")[0];

    try {
      //API 호출
      const response = await fetch(
        `http://www.cha.go.kr/cha/openapi/selectEventListOpenapi.do=${formattedDate}`
      );
      const data = await response.json();
      setEvents(data); // 가져온 데이터 저장
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]); //에러 발생 시 빈 데이터로 설정
    }
  };

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
        <h1 className="MainFont font-semibold text-5xl pb-5">행사 정보</h1>
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
              <li key={idx} className="mr-8">
                <button
                  to={item.to}
                  className={`border hover:bg-blue-800 hover:text-white border-slate-500 rounded-md p-1 font-semibold px-2 ${
                    item.label === "경상도" ? "Gyeongsang" : ""
                  } ${item.label === "서울" ? "seoul" : ""}
                  ${item.label === "인천" ? "incheon" : ""}`}
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
      <div className="Event-information border-2 border-blue-800 px-[1rem] w-full h-auto max-h-72  mt-10 max-w-[1280px] ml-[11.6rem] rounded-md ">
        <h2 className="MainFont text-3xl font-semibold pb-5">
          {date.toLocaleDateString("ko-KR")} 행사 정보
        </h2>
        <ul>
          {events.length > 0 ? (
            events.map((event, idx) => (
              <li key={idx} className="pb-2">
                {event.title} - {event.location}
              </li>
            ))
          ) : (
            <p className="SubFont text-xl">해당 날짜에 행사가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Event_schedule;
