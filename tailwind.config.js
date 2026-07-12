/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#082f2e",
        teal: "#0b4b49",
        tealLight: "#176d68",
        mint: "#63d2c3",
        cream: "#fff4e4",
        paper: "#fffdf9",
        orange: "#ff6b2c",
        yellow: "#ffc44d",
        leaf: "#78a947"
      },
      fontFamily: {
        display: ["Baloo 2", "system-ui", "sans-serif"],
        body: ["Nunito Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(8,47,46,.17)",
        card: "0 14px 45px rgba(8,47,46,.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};
