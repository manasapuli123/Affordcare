/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F3F5F4",
        surface: "#FFFFFF",
        ink: "#1B2A2E",
        muted: "#5B6B67",
        faint: "#6A7773",
        border: "#E1E4E2",
        harbor: {
          light: "#E4F0EC",
          DEFAULT: "#0E6B5C",
          dark: "#0A4E44",
        },
        gold: {
          light: "#F7E9D8",
          DEFAULT: "#C97A2B",
          dark: "#8F5518",
        },
        success: {
          light: "#E4F3E7",
          DEFAULT: "#2F7D45",
          dark: "#1F5A30",
        },
        warning: {
          light: "#FBEEDB",
          DEFAULT: "#B8791E",
          dark: "#845413",
        },
        danger: {
          light: "#FBE7E7",
          DEFAULT: "#B23B3B",
          dark: "#832A2A",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
