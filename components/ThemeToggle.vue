<template>
    <button
      class="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
      @click="toggle"
      aria-label="Toggle dark mode"
    >
      <span v-if="isDark">🌙 Dark</span>
      <span v-else>☀️ Light</span>
    </button>
  </template>
  
  <script setup lang="ts">
  const isDark = ref(false)
  
  onMounted(() => {
    const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    isDark.value = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  })
  
  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  </script>
  