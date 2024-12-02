import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../redux/slices/eventSlice";
const Event = () => {
  const dispatch = useDispatch();
  const { event, loading, error } = useSelector((state) => state.event); // Ensure the state key matches the slice name

  useEffect(() => {
    dispatch(fetchEvent()); // Dispatch the async thunk to fetch events
  }, [dispatch]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error}</p>;

  return (
    <div>
      <h1>Event List</h1>
      {event.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {event.map((event, index) => (
            <li key={index}>
              <h2>{event.title}</h2>
              <p>Hosted by: {event.host_inst_nm}</p>
              <p>Time: {event.event_tm_info}</p>
              <p>Date: {event.begin_de}</p>
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{ width: "200px", marginTop: "10px" }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Event;
