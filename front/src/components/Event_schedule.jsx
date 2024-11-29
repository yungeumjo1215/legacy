import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TiStarFullOutline } from "react-icons/ti";
import { areaLink } from "../constans/data";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";

const Event_schedule = () => {
  const dispatch = useDispatch();
  const { festivalList, loading, error } = useSelector(
    (state) => state.festival
  );
  const [date, setDate] = useState(new Date()); // 선택된 날짜
  const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 지역
  const [search, setSearch] = useState(""); // 검색창 상태
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목 상태

  useEffect(() => {
    dispatch(fetchFestivalData());
  }, [dispatch]);

  // 날짜 필터링
  const filteredByDate = festivalList.filter((event) => {
    const eventDate = new Date(event.date).toISOString().split("T")[0];
    const selectedDate = date.toISOString().split("T")[0];
    return eventDate === selectedDate;
  });
  // 지역 필터링
  const filteredByRegion = selectedRegion
    ? filteredByDate.filter((event) => event.region === selectedRegion)
    : filteredByDate;

  // 검색 필터링
  const filteredBySearch = search
    ? filteredByRegion.filter((event) =>
        event.region.toLowerCase().includes(search.toLowerCase())
      )
    : filteredByRegion;

  // 즐겨찾기
  const handleStarClick = (index) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(index)
        ? prevSelectedItems.filter((item) => item !== index)
        : [...prevSelectedItems, index]
    );
  };
  // 날짜 변경
  const handleDateChange = (newDate) => {
    // console.log("Selected Date (raw):", newDate);
    // newDate가 유효한 Date 객체인지 확인
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      console.error("Invalid date selected:", newDate); // 잘못된 값이 들어오면 에러 로그 출력
      return;
    }
    // 정상적인 Date 객체일 때
    // const formattedDate = newDate.toISOString().split("T")[0];
    // console.log("Formatted Date:", formattedDate);

    setDate(newDate);
  };
  // 지역 버튼 클릭
  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };
  // 검색창 입력
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    // console.log("Date state has changed to:", date);
    // 다른 코드로 인해 예기치 않은 상태 변화가 발생하지 않는지 확인
  }, [date]);

  // const formattedDate =
  //   date instanceof Date ? date.toISOString().split("T")[0] : "";
  // console.log("Formatted Date:", formattedDate);

  // console.log("Type of date:", typeof date);
  // console.log("Is date an instance of Date?", date instanceof Date);

  return (
    <div className="w-full h-auto mt-10" style={{ paddingTop: "4rem" }}>
      <div className="container">
        <h1 className="MainFont font-semibold text-5xl pb-5">행사 정보</h1>
      </div>
      <div className="MC w-full h-auto flex justify-between border-2 rounded-md">
        <div className="search">
          <form className="flex m-5 w-full h-auto">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={handleSearchChange}
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
            <span className="font-semibold text-2xl">지역:</span>
            {areaLink.map((item, idx) => (
              <li key={idx} className="mr-8">
                <button
                  onClick={() => handleRegionClick(item.label)}
                  className={`border hover:bg-blue-800 hover:text-white border-slate-500 rounded-md p-1 font-semibold px-2 shadow-md ${
                    selectedRegion === item.label
                      ? "bg-blue-800 text-white"
                      : ""
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
            onClick={() => console.log("Calendar clicked!")}
          />
        </div>
      </div>
      <div className="Event-information MC w-full h-[200px] max-h-72 rounded-md ">
        <div className="w-full">
          <h2 className="MainFont w-full py-3 px-6 border-b-2 border-blue-100 text-3xl font-semibold mb-8">
            {date.toLocaleDateString("ko-KR")} 행사 정보
          </h2>
        </div>
        <ul>
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p className="SubFont text-xl px-6">{error}</p>
          ) : filteredBySearch.length > 0 ? (
            filteredBySearch.map((event, idx) => (
              <li key={idx} className="pb-2">
                <div className="border">
                  <button
                    onClick={() => handleStarClick(idx)}
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      display: "inline-block",
                      color: selectedItems.includes(idx)
                        ? "#FFD700"
                        : "#DCDCDC",
                    }}
                  >
                    <TiStarFullOutline className="text-3xl" />
                  </button>
                  {event.title} - {event.region}
                </div>
              </li>
            ))
          ) : (
            <p className="SubFont text-xl px-6">해당 날짜에 행사가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Event_schedule;
