/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a", // Elegant Green
        secondary: "#1e293b", // Dark gray for contrast
        textDark: "#1e293b", // Dark text for readability
        textLight: "#64748b", // Muted gray for subtle details
        borderGray: "#e2e8f0", // Soft border color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};