<template>
  <ClientOnly><VitePwaManifest /></ClientOnly>

  <div class="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
    <nav class="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/10">
      <div class="mx-auto max-w-5xl flex items-center gap-4 px-6 py-3">
        <NuxtLink to="/" class="font-semibold text-slate-900 dark:text-slate-100">Offline Normalizer</NuxtLink>
        <div class="ml-auto flex items-center gap-4 text-sm">
          <NuxtLink to="/" class="text-slate-700 dark:text-slate-300 hover:underline">Home</NuxtLink>
          <NuxtLink to="/about" class="text-slate-700 dark:text-slate-300 hover:underline">About</NuxtLink>
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>

    <SiteFooter :slug="bmcSlug" />
  </div>
</template>

<script setup lang="ts">
const bmcSlug = (import.meta.env.VITE_BMC_SLUG as string) || 'your-slug' // my BMC-slug
</script>