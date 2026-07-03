/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8FC",
        surface: "#FFFFFF",
        ink: "#1E2333",
        muted: "#5C5F6B",
        faint: "#6B6E7A",
        border: "#E4E4EF",
        harbor: {
          light: "#E8E7FB",
          DEFAULT: "#4C3FC9",
          dark: "#332A8E",
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
          light: "#F7E7DA",
          DEFAULT: "#B5651D",
          dark: "#9E5416",
        },
        success: {
          light: "#E3F3E5",
          DEFAULT: "#2E8B4F",
          dark: "#1D5E34",
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
