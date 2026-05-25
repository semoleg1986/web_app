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
  routeRules: {
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    "/**": {
      headers: {
        "Cache-Control": "private, no-cache, no-store, no-transform, must-revalidate, max-age=0",
        Expires: "0",
        Pragma: "no-cache"
      }
    }
  },
  runtimeConfig: {
    authServiceBaseUrl: "http://localhost:8000",
    bonusServiceBaseUrl: "http://localhost:8006",
    commercialCatalogServiceBaseUrl: "http://localhost:8007",
    courseServiceBaseUrl: "http://localhost:8001",
    paymentsServiceBaseUrl: "http://localhost:8004",
    usersServiceBaseUrl: "http://localhost:8002",
    public: {
      apiBaseUrl: "/api",
      appName: "Curs Platform",
      siteUrl: "http://localhost:3000"
    }
  }
});
