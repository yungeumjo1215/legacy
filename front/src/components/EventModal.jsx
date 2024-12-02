import React from "react";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-lg shadow-xl z-50 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div>
          <div className="flex justify-between items-center mb-[8px]">
            <h2 className="MainFont text-2xl">{event.programName}</h2>
            <button
              onClick={onClose}
              className="bg-[#121a35] text-white px-4 py-1 border-none text-[20px] rounded cursor-pointer"
            >
              X
            </button>
          </div>
          <div className="SubFont text-2xl space-y-3">
            <div className="border border-gray-700 w-full p-4 rounded-md text-gray-950 whitespace-pre-line overflow-hidden text-[20px]">
              <p>{event.programContent}</p>
            </div>

            <div className="SubFont grid grid-cols-2 gap-4 text-lg">
              <div>
                <p>기간</p>
                <p>
                  {event.startDate} ~ {event.endDate}
                </p>
              </div>
              <div>
                <p>장소</p>
                <p>{event.location}</p>
              </div>
              <div>
                <p>대상</p>
                <p>{event.targetAudience}</p>
              </div>
              <div>
                <p>문의</p>
                <p>{event.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
