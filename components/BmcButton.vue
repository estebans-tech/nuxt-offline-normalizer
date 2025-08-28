<template>
    <a
      :href="`https://buymeacoffee.com/${slug}`"
      target="_blank" rel="noopener"
      :class="classes"
      aria-label="Support this project"
    >
      <span aria-hidden>☕</span>
      <span>{{ label }}</span>
    </a>
  </template>
  
  <script setup lang="ts">
  const props = withDefaults(defineProps<{
    slug: string
    variant?: 'subtle' | 'link' | 'icon'
    label?: string
  }>(), {
    variant: 'subtle',
    label: 'Support'
  })
  
  const classes = computed(() => {
    if (props.variant === 'link') {
      return 'text-slate-400 hover:text-slate-200 underline decoration-slate-500/40 hover:decoration-slate-300/70 text-xs'
    }
    if (props.variant === 'icon') {
      return 'text-sm inline-flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800/60 ring-1 ring-white/10 transition text-xs'
    }
    // subtle (default): diskret “pill” som matchar bakgrunden
    return 'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-slate-800/60 ring-1 ring-white/10 transition text-xs'
  })
  </script>
  