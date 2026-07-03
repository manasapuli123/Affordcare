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
        plum: {
          light: "#F3E7EF",
          DEFAULT: "#8E3E72",
          dark: "#5E2A4C",
        },
        sky: {
          light: "#E3EEFB",
          DEFAULT: "#2F6FB0",
          dark: "#1F4C7A",
        },
        gold: {
          light: "#F5E6D8",
          DEFAULT: "#A85A2A",
          dark: "#7A3E1A",
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
