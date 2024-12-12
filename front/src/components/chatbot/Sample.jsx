import React, { useState, useEffect } from "react";
import axios from "axios";

const Sample = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heritageResponse, festivalsResponse] = await Promise.all([
          axios.get("http://localhost:8000/pgdb/heritageSample"),
          axios.get("http://localhost:8000/pgdb/festivalsSample"),
        ]);

        const combinedData = {
          heritage: heritageResponse.data,
          festivals: festivalsResponse.data,
        };

        console.log(combinedData);
        setData(combinedData);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  return (
    <div className="sample">
      {data ? (
        <div>
          <div className="heritage">
            <ul>
              {data.heritage.map((item, i) => (
                <li key={i}>
                  <p>{item.ccbalcad}</p>
                  <p>{item.ccbamnm1}</p>
                  <p>{item.content}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="festivals">
            {JSON.stringify(data.festivals, null, 2)}
          </div> */}
        </div>
      ) : (
        <p>데이터 로딩 중...</p>
      )}
    </div>
  );
};

export default Sample;
