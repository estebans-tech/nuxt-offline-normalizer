<template>
    <footer class="mt-12 border-t border-white/10">
      <div class="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-center gap-3">
        <p class="text-xs text-slate-400">
          Built with Nuxt + WebLLM. Nothing leaves your device.
        </p>
        <div class="sm:ml-auto">
          <BmcButton :slug="slug" variant="subtle" label="Buy me a coffee" />
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  defineProps<{ slug: string }>()
  </script>