import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FavoriteList from "./FavoriteList";
import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";

const Mypage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!isLoggedIn && !token) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/account/info");
        setUserInfo(response.data);
      } catch (err) {
        console.error("사용자 정보 로드 에러:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 mt-16">
      <div className="flex h-full">
        {/* 사이드바 */}
        <div className="w-80 bg-white shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaUser className="text-blue-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">내 정보</h2>
          </div>
          {userInfo && (
            <div className="space-y-6">
              <div className="hover:bg-gray-50 p-4 rounded-lg transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <FaEnvelope className="text-blue-500" />
                  <p className="text-gray-600 font-medium">이메일</p>
                </div>
                <p className="text-gray-900 font-medium pl-8">
                  {userInfo.email}
                </p>
              </div>
              <div className="hover:bg-gray-50 p-4 rounded-lg transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  <FaUser className="text-blue-500" />
                  <p className="text-gray-600 font-medium">이름</p>
                </div>
                <p className="text-gray-900 font-medium pl-8">
                  {userInfo.username}
                </p>
              </div>
              {userInfo.created_at && (
                <div className="hover:bg-gray-50 p-4 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaCalendar className="text-blue-500" />
                    <p className="text-gray-600 font-medium">가입일</p>
                  </div>
                  <p className="text-gray-900 font-medium pl-8">
                    {new Date(userInfo.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 p-4">
          <FavoriteList />
        </div>
      </div>
    </div>
  );
};

export default Mypage;
