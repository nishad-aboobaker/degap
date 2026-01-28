/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          light: "#60A5FA",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          dark: "#7C3AED",
          light: "#A855F7",
        },
        success: {
          DEFAULT: "#10B981",
          soft: "#D1FAE5",
          strong: "#047857",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FEF3C7",
          strong: "#B45309",
        },
        danger: {
          DEFAULT: "#EF4444",
          soft: "#FEE2E2",
          strong: "#B91C1C",
        },
        neutral: {
          25: "#F9FAFB",
          50: "#F3F4F6",
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#9CA3AF",
          400: "#6B7280",
          500: "#4B5563",
          600: "#374151",
          700: "#1F2933",
          800: "#111827",
        },
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
}

