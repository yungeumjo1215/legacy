// - REGIONS: 전국 지역 정보 (시도별)
// - SOLAR_HOLIDAYS: 양력 공휴일 목록
// - LUNAR_HOLIDAY_MAP: 연도별 음력 공휴일 날짜 매핑
export const REGIONS = [
  { id: "all", name: "전체", sido: null },
  { id: "seoul", name: "서울", sido: "서울특별시" },
  { id: "incheon", name: "인천", sido: "인천광역시" },
  { id: "busan", name: "부산", sido: "부산광역시" },
  { id: "ulsan", name: "울산", sido: "울산광역시" },
  { id: "gyeonggi", name: "경기도", sido: "경기도" },
  { id: "gangwon", name: "강원도", sido: "강원도" },
  { id: "chungcheong", name: "충청도", sido: ["충청북도", "충청남도"] },
  { id: "gyeongsang", name: "경상도", sido: ["경상북도", "경상남도"] },
  { id: "jeolla", name: "전라도", sido: ["전라북도", "전라남도"] },
  { id: "jeju", name: "제주도", sido: "제주특별자치도" },
];

export const SOLAR_HOLIDAYS = {
  "0101": "신정",
  "0301": "삼일절",
  "0505": "어린이날",
  "0606": "현충일",
  "0815": "광복절",
  1003: "개천절",
  1009: "한글날",
  1225: "크리스마스",
};

export const LUNAR_HOLIDAY_MAP = {
  2024: {
    설날: ["0209", "0210", "0211"],
    부처님오신날: ["0515"],
    추석: ["0916", "0917", "0918"],
  },
  2025: {
    설날: ["0128", "0129", "0130"],
    부처님오신날: ["0505"],
    추석: ["1005", "1006", "1007"],
  },
  2026: {
    설날: ["0217", "0218", "0219"],
    부처님오신날: ["0524"],
    추석: ["0925", "0926", "0927"],
  },
};
