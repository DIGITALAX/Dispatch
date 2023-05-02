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
      fontSize: {
        xxs: "0.5rem",
      },
    },
  },
  plugins: [],
};
