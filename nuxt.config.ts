export default defineNuxtConfig({
  ssr: true,
  nitro: { preset: "netlify" },
  compatibilityDate: '2025-08-28',
  modules: [
    "@vite-pwa/nuxt"
  ],
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}, // ✅ v4-plugin
      autoprefixer: {}
    }
  },
  vite: { worker: { format: "es" } },
  runtimeConfig: {
    public: {
      supportedLangs: ["en", "de", "es", "sv"],
      defaultTargetLang: "en",
      pivotLang: "en",
      webllmModelId: "Llama-3.1-8B-Instruct-q4f32_1-MLC"
      // webllmModelId: "Qwen2-1.5B-Instruct-q4f16_1-MLC"
    }
  }
})
