import default_Img from "../../../assets/festival.png";

export const handleImageError = (event) => {
  event.target.src = default_Img;
  event.target.alt = "이미지를 불러올 수 없습니다";
};

export const onErrorImg = (e) => {
  e.target.src = default_Img;
};
