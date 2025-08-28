<template>
    <span :class="['inline-flex items-center rounded-full px-2 py-1 text-xs font-medium', color]">
      <span class="w-2 h-2 rounded-full mr-2" :class="dot"></span>
      <slot />
    </span>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ status?: 'idle' | 'loading' | 'ready' | 'error' }>()
  const color = computed(() => ({
    idle: 'bg-gray-100 text-gray-800',
    loading: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }[props.status || 'idle']))
  const dot = computed(() => ({
    idle: 'bg-gray-400',
    loading: 'bg-yellow-500 animate-pulse',
    ready: 'bg-green-500',
    error: 'bg-red-500'
  }[props.status || 'idle']))
  </script>