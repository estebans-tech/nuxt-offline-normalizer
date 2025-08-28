export default defineNuxtConfig({
  ssr: true,
  nitro: { preset: "netlify" },
  compatibilityDate: '2025-08-28',
  modules: ["@vite-pwa/nuxt"],
  vite: { worker: { format: "es" } },
  runtimeConfig: {
    public: {
      supportedLangs: ["en", "de", "es", "sv"],
      defaultTargetLang: "en",
      pivotLang: "en",
      // VÄLJ ETT GILTIGT ID (rekommenderad liten modell):
      webllmModelId: "Qwen2-1.5B-Instruct-q4f16_1-MLC"
      // Alternativ (större/bättre): "Llama-3.1-8B-Instruct-q4f32_1-MLC"
    }
  }
})