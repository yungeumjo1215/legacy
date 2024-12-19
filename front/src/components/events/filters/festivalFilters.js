import { parseYYYYMMDD } from "../utils/dateUtils";

// 축제 데이터 필터링 관련 함수
// - matchesRegionFilter: 선택된 지역에 따른 축제 필터링
// - filterFestivals: 날짜, 검색어, 지역에 따른 축제 목록 필터링

export const matchesRegionFilter = (sido, selectedRegion) => {
  if (selectedRegion === "all") return true;
  if (!sido) return false;

  let regionSido;
  if (Array.isArray(sido)) {
    regionSido = sido[0]?.toLowerCase() || "";
  } else if (typeof sido === "string") {
    regionSido = sido.toLowerCase();
  } else {
    regionSido = "";
  }

  const regionMatches = {
    seoul: /서울|seoul/i,
    incheon: /인천|incheon/i,
    gyeonggi: /경기|gyeonggi/i,
    gangwon: /강원|gangwon/i,
    jeolla: /전라|전북|전남|광주|jeolla|gwangju/i,
    chungcheong: /충청|충북|충남|대전|chungcheong|daejeon/i,
    gyeongsang: /경상|경북|경남|대구|gyeongsang|daegu/i,
    busan: /부산|busan/i,
    ulsan: /울산|ulsan/i,
    jeju: /제주|jeju/i,
  };

  return regionMatches[selectedRegion]?.test(regionSido) ?? false;
};

export const filterFestivals = (festivalList, date, search, selectedRegion) => {
  if (!Array.isArray(festivalList)) return [];

  return festivalList.filter((festival) => {
    try {
      const startDate = parseYYYYMMDD(festival.startDate);
      const endDate = parseYYYYMMDD(festival.endDate);
      if (!startDate || !endDate) return false;

      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      const matchesDate = currentDate >= startDate && currentDate <= endDate;
      const matchesSearch = festival.programName?.[0]
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRegion = matchesRegionFilter(festival.sido, selectedRegion);

      return matchesDate && matchesSearch && matchesRegion;
    } catch (error) {
      console.error("Festival filtering error:", error, festival);
      return false;
    }
  });
};
