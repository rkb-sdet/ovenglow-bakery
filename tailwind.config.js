/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          crust: "#C86D51",
          crustDark: "#9E472A",
          honey: "#F4A261",
          cream: "#FFFDF9",
          dough: "#FBF7F0",
          espresso: "#2B1E16",
          cocoaMuted: "#6B5B52",
          sage: "#588157",
          crimson: "#E63946",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(200, 109, 81, 0.15)',
        'warm-hover': '0 20px 40px -15px rgba(200, 109, 81, 0.25)',
      }
    },
  },
  plugins: [],
}