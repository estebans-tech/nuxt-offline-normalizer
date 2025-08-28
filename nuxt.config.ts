export default defineNuxtConfig({
  ssr: true,
  modules: [
  '@vite-pwa/nuxt',
  ],
  nitro: {
  // Use Netlify preset so server routes deploy as Netlify Functions
  preset: 'netlify'
  },
  routeRules: {
  '/**': { ssr: true },
  },
  vite: {
  worker: { format: 'es' }
  },
  pwa: {
  registerType: 'autoUpdate',
  manifest: {
  name: 'Offline Normalizer',
  short_name: 'Normalizer',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#111111',
  icons: []
  },
  workbox: {
  globPatterns: ['**/*.{js,css,html,svg,png,webp,wasm,bin,model}'],
  runtimeCaching: [
  {
  urlPattern: ({ url }) => url.pathname.startsWith('/bergamot/'),
  handler: 'CacheFirst',
  options: { cacheName: 'bergamot-assets', expiration: { maxEntries: 50 } }
  },
  {
  urlPattern: ({ url }) => url.pathname.includes('/webllm'),
  handler: 'CacheFirst',
  options: { cacheName: 'webllm-assets', expiration: { maxEntries: 50 } }
  }
  ]
  }
  },
  runtimeConfig: {
  public: {
  // Initial languages in priority order (extensible later)
  supportedLangs: ['en', 'de', 'es', 'sv'],
  defaultTargetLang: 'en',
  pivotLang: 'en',
  webllmModelId: 'Llama-3.1-8B-Instruct-q4f16_1'
  }
  }
  })