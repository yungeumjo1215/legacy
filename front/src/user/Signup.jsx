import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/account/create", {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      if (response.status === 201) {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-white">
      <div className="max-w-md w-full m-4 space-y-8 p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 bg-clip-text text-transparent">
            회원가입
          </h2>
          <p className="mt-2 text-center text-base text-gray-900 font-medium">
            새로운 계정을 만들어보세요
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                사용자 이름
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="홍길동"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 hover:from-blue-800 hover:via-blue-500 hover:to-blue-300"
            >
              회원가입
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-base text-gray-900">
            이미 계정이 있으신가요?{" "}
          </span>
          <Link
            to="/login"
            className="text-base bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 bg-clip-text text-transparent font-medium hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
