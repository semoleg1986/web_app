export default defineNuxtConfig({
  ssr: true,
  srcDir: "src/",
  dir: {
    public: "../public"
  },
  css: ["~/app/styles/main.css"],
  devtools: { enabled: false },
  nitro: {
    preset: "node-server"
  },
  runtimeConfig: {
    authServiceBaseUrl: "http://localhost:8000",
    bonusServiceBaseUrl: "http://localhost:8006",
    courseServiceBaseUrl: "http://localhost:8001",
    paymentsServiceBaseUrl: "http://localhost:8004",
    public: {
      apiBaseUrl: "/api",
      appName: "Curs Platform",
      siteUrl: "http://localhost:3000"
    }
  }
});
