// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL || "", // กำหนดค่าเริ่มต้นให้ BASE_URL
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
