import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFestivalData } from "../redux/slices/festivalDetailSlice";

const FestivalTable = () => {
  const dispatch = useDispatch();
  const { festivalList, loading, error } = useSelector(
    (state) => state.festival
  );

  useEffect(() => {
    dispatch(fetchFestivalData());
  }, [dispatch]);

  if (loading) return <p>Loading festival data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Program Name</th>
          <th>Content</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Location</th>
          <th>Contact</th>
          <th>Target Audience</th>
          <th>Additional Info</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {festivalList.map((festival, index) => (
          <tr key={index}>
            <td>{festival.programName}</td>
            <td>{festival.programContent}</td>
            <td>{festival.startDate}</td>
            <td>{festival.endDate}</td>
            <td>{festival.location}</td>
            <td>{festival.contact}</td>
            <td>{festival.targetAudience}</td>
            <td>{festival.additionalInfo}</td>
            <td>
              {festival.image !== "N/A" ? (
                <img
                  src={festival.image}
                  alt={festival.programName}
                  style={{ maxWidth: "100px", borderRadius: "5px" }}
                />
              ) : (
                "No Image"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FestivalTable;
