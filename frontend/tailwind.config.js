/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EFEAD9",
        paper2: "#E6E0CB",
        ink: "#22281F",
        inkfade: "#565B4E",
        line: "#C9C2A6",
        moss: "#3F5C40",
        mossdark: "#2C4230",
        rust: "#9C3B27",
        rustdark: "#7A2E1E",
        ochre: "#8C6F2F",
        ochredark: "#6E571F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        card: "6px",
      },
      boxShadow: {
        stamp: "0 1px 0 rgba(34,40,31,0.15)",
      },
    },
  },
  plugins: [],
};
