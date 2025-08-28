import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app.vue',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      borderRadius: { brand: '1.25rem' },
      boxShadow: { brand: '0 10px 30px -12px rgba(0,0,0,0.25)' }
    }
  },
  plugins: []
}