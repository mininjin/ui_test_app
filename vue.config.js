/** @type {import('@vue/cli-service').ProjectOptions} */

const config = {
  publicPath: "./",
  pages: {
    index: {
      title: "UI test app",
      entry: "src/main.ts",
    },
  },
  pwa: {
    name: "UI test app",
    themeColor: "#bae8e8",
    manifestOptions: {
      start_url: "./index.html",
      display: "fullscreen",
    },
  },
};

module.exports = config;
