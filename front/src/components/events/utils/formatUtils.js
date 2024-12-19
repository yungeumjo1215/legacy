import { formatDateString } from "./dateUtils";

// 데이터 포맷팅 유틸리티 함수
// - 텍스트 길이 제한
// - 축제 데이터 정규화
// - 배열 데이터 처리

export const formatValue = (value) => {
  if (value === "N/A") return "모두";
  if (typeof value === "string" && value.length > 20) {
    return value.substring(0, 20) + "...";
  }
  return value;
};

const getFirstArrayItem = (item) => {
  return Array.isArray(item) ? item[0] : item;
};

export const formatFestivalData = (festival) => {
  return {
    programName: getFirstArrayItem(festival.programName),
    festivalid: getFirstArrayItem(festival.festivalid),
    programContent: getFirstArrayItem(festival.programContent),
    startDate: formatDateString(festival.startDate),
    endDate: formatDateString(festival.endDate),
    location: getFirstArrayItem(festival.location),
    contact: getFirstArrayItem(festival.contact),
    image: getFirstArrayItem(festival.image),
    targetAudience: getFirstArrayItem(festival.targetAudience),
  };
};
