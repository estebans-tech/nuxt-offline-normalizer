<template>
    <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div class="h-full bg-slate-900 dark:bg-slate-200 transition-all" :style="{ width }"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ value?: number }>()
  const width = computed(() => `${Math.min(100, Math.max(0, props.value ?? 0))}%`)
  </script>
  