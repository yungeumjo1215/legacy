import React, { memo } from "react";

// 검색바 UI 컴포넌트
// - 행사명 검색 입력 폼
// - 검색 버튼 포함
const SearchBar = memo(({ value, onChange }) => (
  <div className="flex justify-center w-full">
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full sm:w-auto md:w-[400px]"
    >
      <input
        type="text"
        placeholder="행사명을 입력해주세요"
        value={value}
        onChange={onChange}
        className="Event-sc rounded-s-[5px] flex-1 p-2"
      />
      <button
        type="submit"
        className="relative border MainColor text-white rounded-e-[5px] px-4 whitespace-nowrap group inline-block hover:animate-[push_0.3s_linear_1] active:translate-y-0 hover:bg-blue-700"
      >
        <span className="relative z-10">검색</span>
      </button>
    </form>
  </div>
));

export default SearchBar;
