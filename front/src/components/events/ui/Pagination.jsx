import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          이전
        </button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? "bg-blue-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          다음
        </button>
      )}
    </div>
  );
};

export default Pagination;
