/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arcade: "Arcade Classic",
        geom: "Geometria",
        earl: "Earls Revenge",
        economica: "Economica R",
        economicaB: "Economica B",
        digi: "DS DIGITAL",
        chill: "Chillax B",
      },
      colors: {
        verde: "#25EC68",
        rosa: "#f62ada",
        light: "#DDC2DE",
        azul: "#B9D9FF",
        lensLight: "#ABFE2C",
        offBlack: "#131313",
        pink: "#F06AAF",
        pesa: "#C9D8E4",
        ama: "#FBDB86",
        moda: "#CFB0FA",
        playa: "#0D3DFF",
        rojo: "#DD3950",
        leche: "#FFFFF2",
        cit: "#F7B500",
        b1: "#6BD6FC",
        b2: "#1696FC",
        offBlue: "#81A8F8",
        midi: "#A6BEE2",
        greenG: "#AFFFA1",
        marip: "#FFFC80",
        lunar: "#C86FFF",
        lily: "#F0BBF4",
        pos: "#5433FD",
      },
      height: {
        100: "27rem",
        128: "32rem",
        184: "42rem",
        210: "47rem",
      },
      zIndex: {
        1: "1",
        2: "2",
      },
      backgroundImage: {
        chroma:
          "url('https://chromadin.infura-ipfs.io/ipfs/QmbfVYvza1xVqGRWiremt4LVKkTPDA8bnURdu39cgP71gd')",
      },
      transformOrigin: {
        homeAnim: "0 0",
      },
      fontSize: {
        xxs: "0.5rem",
      },
      screens: {
        galaxy: "300px",
        preG: "480px",
        new: "500px",
        mid: "950px",
        tablet: "1260px",
        wrap: "1360px",
        alto: "1950px",
        mode: "870px",
      },
    },
  },
  plugins: [],
};
