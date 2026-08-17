/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          700: "#c2410c",
          900: "#7c2d12"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(120, 53, 15, 0.12)"
      }
    }
  },
  plugins: []
};
