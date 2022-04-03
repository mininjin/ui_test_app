/** @type{import("@types/tailwindcss/tailwind-config").TailwindConfig} */

const config = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "1/12": "8.333333%",
        "5/12": "41.666667%",
        "7/12": "58.333333%",
        "11/12": "91.666667%",
        "1/8": "12.5%",
        "3/8": "37.5%",
        "5/8": "62.5%",
        "7/8": "87.5%",
      },
      colors: {
        theme: "var(--theme-color)",
        sub: "var(--sub-color)",
        next: "var(--next-color)",
        container: "var(--container-color)",
        background: "var(--background-color)",
        footer: "var(--footer-color)",
        copyright: "var(--copyright-color)",
        link: "var(--link-color)",
        error: "var(--error-color)",
        title: "var(--title-color)",
      },
      translate: {
        "-1/6": "-16.666667%",
        "-1/5": "-20%",
      },
      fontFamily:{
        name:"var(--font-name)",
        title:"var(--font-title)",
      }
    },
  },
  plugins: [],
};

module.exports = config;
