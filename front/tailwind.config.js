/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Gowun Batang", "serif"],
      },
      keyframes: {
        push: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        sendPlane: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(6px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "send-plane": "sendPlane 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
