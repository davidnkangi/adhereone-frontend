/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16233B",
        "ink-light": "#233858",
        paper: "#F5F6F2",
        line: "#D8DBD3",
        compliant: "#2F6F52",
        gap: "#A6432E",
        pending: "#9C7A26",
        muted: "#6B7280",
      },
      fontFamily: {
        serif: ["Source Serif 4", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
