<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <div class="rounded-2xl bg-white/90 dark:bg-slate-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 space-y-6">
      <header>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Offline Normalizer</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Clear, simple English rewrites — on your device.</p>
      </header>

      <!-- Input -->
      <section class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Your text</label>
        <textarea
          v-model="text"
          rows="6"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
          placeholder="Place your weird text here…">
        </textarea>
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Chars: {{ (text || '').length }}</span>
          <span v-if="srcLang">Detected: <strong class="font-medium">{{ srcLang }}</strong></span>
        </div>
      </section>

      <!-- Controls: endast Normalize + status -->
      <section class="flex items-center gap-3">
        <button
          :disabled="running || !(text && text.trim())"
          @click.prevent="onRun"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-2.5 font-medium disabled:opacity-50 hover:bg-slate-800 transition"
        >
          <span v-if="running" class="inline-flex items-center gap-2"><Spinner /> {{ progress || 'Processing…' }}</span>
          <span v-else>Normalize</span>
        </button>
        <ModelStatusBadge :status="badgeStatus">
          <span v-if="running">{{ progress }}</span>
          <span v-else>On-device</span>
        </ModelStatusBadge>
      </section>

      <!-- Progress bar -->
      <div v-if="running" class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div class="h-full bg-slate-900 dark:bg-slate-200 transition-all" :style="{ width: progressWidth }"></div>
      </div>

      <!-- Output -->
      <section class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Result</label>
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 whitespace-pre-wrap min-h-[6rem]">
          {{ result || '— (no output yet)' }}
        </div>
      </section>

      <p class="text-xs text-slate-500 dark:text-slate-400">Nothing leaves your device. Target language is fixed to English; style is “simple”.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNormalize } from "~/composables/useNormalize"

const { text, result, srcLang, running, progress, initLangs, run } = useNormalize()

onMounted(() => { initLangs() })
const onRun = () => run("en", "simple") // ← tvinga engelska + simple

const badgeStatus = computed(() => (running.value ? "loading" : "ready"))
const progressWidth = computed(() => {
  const txt = (progress.value ?? '').toString()
  const m = txt.match(/^(\d+)%/)
  const pct = m ? parseInt(m[1]!, 10) : (running.value ? 15 : 0)
  return `${Math.min(100, Math.max(0, pct))}%`
})
</script>
