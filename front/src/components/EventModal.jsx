import React from "react";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-lg shadow-xl z-50 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="space-y-4">
          <h2 className="MainFont text-3xl font-bold">{event.programName}</h2>

          {event.image && event.image !== "N/A" && (
            <img
              src={event.image}
              alt={event.programName}
              className="w-full rounded-lg"
            />
          )}

          <div className="text-2xl space-y-3">
            <p className="SubFont border border-gray-700 w-full p-4  rounded-md text-gray-950 whitespace-pre-line overflow-hidden">
              {event.programContent}
            </p>

            <div className="MainFont grid grid-cols-2 gap-4 text-lg">
              <div>
                <p className="font-semibold">기간</p>
                <p>
                  {event.startDate} ~ {event.endDate}
                </p>
              </div>
              <div>
                <p className="font-semibold">장소</p>
                <p>{event.location}</p>
              </div>
              <div>
                <p className="font-semibold">대상</p>
                <p>{event.targetAudience}</p>
              </div>
              <div>
                <p className="font-semibold">문의</p>
                <p>{event.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
