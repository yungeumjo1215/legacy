import React, { useState, useEffect } from "react";
import axios from "axios";

const Sample = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/pgdb/heritageSample",
          "http://localhost:8000/pgdb/festivalsSample"
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sample">
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>데이터 로딩 중...</p>
      )}
    </div>
  );
};

export default Sample;
