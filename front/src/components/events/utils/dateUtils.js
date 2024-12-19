import moment from "moment";
import {
  SOLAR_HOLIDAYS,
  LUNAR_HOLIDAY_MAP,
} from "../constants/holidayConstants";

// 날짜 관련 유틸리티 함수
// - 날짜 파싱 및 포맷팅
// - 공휴일 확인
// - 캘린더 타일 스타일링

export const parseYYYYMMDD = (dateArr) => {
  if (!dateArr || !dateArr[0] || dateArr[0].length !== 8) return null;

  try {
    const dateStr = dateArr[0];
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("날짜 파싱 오류:", error);
    return null;
  }
};

export const formatDateString = (dateString) => {
  if (!dateString) return "";
  if (dateString.length === 8) {
    return `${dateString.slice(0, 4)}-${dateString.slice(
      4,
      6
    )}-${dateString.slice(6, 8)}`;
  }
  return dateString;
};

export const getHolidays = (year) => {
  const holidays = { ...SOLAR_HOLIDAYS };
  if (LUNAR_HOLIDAY_MAP[year]) {
    Object.entries(LUNAR_HOLIDAY_MAP[year]).forEach(([name, dates]) => {
      dates.forEach((date) => {
        const month = date.substring(0, 2);
        const day = date.substring(2);
        holidays[`${month}${day}`] = name;
      });
    });
  }
  return holidays;
};

export const tileClassName = ({ date, view }) => {
  if (view === "month") {
    const formattedDate = moment(date).format("MMDD");
    const year = date.getFullYear();
    const holidays = getHolidays(year);
    const day = date.getDay();
    const isWeekend = day === 0;

    if (holidays[formattedDate] || isWeekend) {
      return "holiday-date";
    }
  }
  return "";
};
