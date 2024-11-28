import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeritageData } from "../redux/slices/heritageDetailSlice";

const ComTest = () => {
  const dispatch = useDispatch();
  const { heritageList, loading, error } = useSelector(
    (state) => state.heritage
  );

  useEffect(() => {
    dispatch(fetchHeritageData());
  }, [dispatch]);

  if (loading) return <p>Loading heritage data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Heritage List</h1>
      <ul>
        {heritageList.map((heritage) => (
          <li key={heritage.ccbaAsno} style={{ marginBottom: "20px" }}>
            <h3>{heritage.ccbaMnm1}</h3>
            <p>
              <strong>Address:</strong> {heritage.ccbaLcad}
            </p>
            <p>
              <strong>Historical Details:</strong> {heritage.ccceName}
            </p>
            <p>{heritage.content}</p>
            <img
              src={heritage.imageUrl}
              alt={heritage.ccbaMnm1}
              width="300"
              style={{ borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComTest;
