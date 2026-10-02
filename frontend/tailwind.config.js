/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        den: {
          black: "#0b0b0b",
          charcoal: "#161513",
          card: "#1c1a17",
          orange: "#d9712e",
          cream: "#f3ece2",
          muted: "#9a938a",
          green: "#8fae63",
        },
      },
      fontFamily: {
        display: ["Oswald", "Arial Narrow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
