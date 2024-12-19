import default_Img from "../../../assets/festival.png";

// 이미지 관련 유틸리티 함수
// - 이미지 로드 실패 시 기본 이미지 처리
export const handleImageError = (event) => {
  event.target.src = default_Img;
  event.target.alt = "이미지를 불러올 수 없습니다";
};

export const onErrorImg = (e) => {
  e.target.src = default_Img;
};
