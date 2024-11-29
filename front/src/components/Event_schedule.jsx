import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TiStarFullOutline } from "react-icons/ti";
import { areaLink } from "../constans/data";
import { useSelector, useDispatch } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";

const EventSchedule = () => {
  const dispatch = useDispatch();
  const { festivalList, loading, error } = useSelector(
    (state) => state.festival
  );
  const [date, setDate] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // Redux를 통한 데이터 로딩
  useEffect(() => {
    dispatch(fetchFestivalData());
  }, [dispatch]);

  // 디버깅을 위한 콘솔 로그
  useEffect(() => {
    if (festivalList.length > 0) {
      console.log("Sample Event Date Format:", festivalList[0].startDate?.[0]);
      console.log("All Festival List:", festivalList);
    }
  }, [festivalList]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "날짜 없음";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "유효하지 않은 날짜";
      return date.toLocaleDateString("ko-KR");
    } catch {
      return "유효하지 않은 날짜";
    }
  };

  // 날짜 필터링
  const filteredByDate = festivalList.filter((event) => {
    if (!event.startDate?.[0]) return false;

    try {
      // 서버에서 받은 날짜 문자열을 Date 객체로 변환
      const eventStartDate = new Date(event.startDate[0]);
      const eventEndDate = new Date(event.endDate[0]);
      const selectedDate = new Date(date);

      // 시간 정보 제거
      eventStartDate.setHours(0, 0, 0, 0);
      eventEndDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      // 선택한 날짜가 시작일과 종료일 사이에 있는지 확인
      return selectedDate >= eventStartDate && selectedDate <= eventEndDate;
    } catch (error) {
      console.error("Date parsing error for event:", event, error);
      return false;
    }
  });

  // 디버깅을 위한 필터링 결과 로그
  useEffect(() => {
    console.log("Selected Date:", date);
    console.log("Filtered Events:", filteredByDate);
  }, [date, filteredByDate]);

  // 지역 필터링
  const filteredByRegion = selectedRegion
    ? filteredByDate.filter((event) => event.location?.[0] === selectedRegion)
    : filteredByDate;

  // 검색어 필터링
  const filteredBySearch = search
    ? filteredByRegion.filter((event) =>
        event.programName?.[0].toLowerCase().includes(search.toLowerCase())
      )
    : filteredByRegion;

  // 즐겨찾기 클릭 처리
  const handleStarClick = (index) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(index)
        ? prevSelectedItems.filter((item) => item !== index)
        : [...prevSelectedItems, index]
    );
  };

  // 날짜 변경 처리
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // 지역 선택 처리
  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  // 검색어 입력 처리
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const regionButtonClass = (region) =>
    `border hover:bg-blue-800 hover:text-white border-slate-500 rounded-md p-1 font-semibold px-2 shadow-md ${
      selectedRegion === region ? "bg-blue-800 text-white" : ""
    } region-btn-${region.toLowerCase()}`;

  return (
    <div className="w-full h-auto mt-10" style={{ paddingTop: "4rem" }}>
      <div className="container">
        <h1 className="MainFont font-semibold text-5xl pb-5">행사 정보</h1>
      </div>
      <div className="MC w-full h-auto flex justify-between border-2 rounded-md">
        <div className="search">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex m-5 w-full h-auto"
          >
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
        <div className="btn flex items-center pl-10">
          <ul className="w-full flex flex-wrap gap-5 pl-10">
            <span className="font-semibold text-2xl">지역:</span>
            {(areaLink || []).map((item, idx) => (
              <li key={idx} className="mr-8">
                <button
                  onClick={() => handleRegionClick(item.label)}
                  className={regionButtonClass(item.label)}
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
            aria-label="날짜 선택 달력"
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
          {loading && <p>로딩 중...</p>}
          {!loading && error && <p className="SubFont text-xl px-6">{error}</p>}
          {!loading &&
            !error &&
            filteredBySearch.length > 0 &&
            filteredBySearch.map((event) => (
              <li
                key={event.id || `${event.programName}-${event.startDate}`}
                className="pb-2"
              >
                <div className="border">
                  <button
                    onClick={() => handleStarClick(event.id)}
                    className={`star-button ${
                      selectedItems.includes(event.id) ? "starred" : ""
                    }`}
                    aria-label={`${event.programName} 즐겨찾기 ${
                      selectedItems.includes(event.id) ? "제거" : "추가"
                    }`}
                  >
                    <TiStarFullOutline className="text-3xl" />
                  </button>
                  {event.programName?.[0] || "행사 이름 없음"} -{" "}
                  {formatDate(event.startDate?.[0])} - {event.location?.[0]}
                </div>
              </li>
            ))}
          {!loading && !error && filteredBySearch.length === 0 && (
            <p className="SubFont text-xl px-6">해당 날짜에 행사가 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventSchedule;
