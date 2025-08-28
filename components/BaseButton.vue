<template>
    <button
      :disabled="disabled"
      class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium
             bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50
             focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 transition"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  defineProps<{ disabled?: boolean }>()
  </script>
  