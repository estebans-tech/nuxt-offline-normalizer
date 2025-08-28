<template>
  <div class="mx-auto max-w-3xl p-6 space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">Offline Normalizer</h1>
      <p class="text-sm text-gray-600">Rewrite odd sentences into clear, standard language — fully on your device.</p>
    </header>

    <section class="space-y-3">
      <label class="text-sm font-medium">Your text</label>
      <textarea v-model="text" rows="6" class="w-full rounded-lg border p-3" placeholder="Skriv något konstigt här…"></textarea>
      <p class="text-xs text-gray-500">Chars: {{ (text || '').length }}</p>
    </section>

    <section class="flex gap-3 items-end flex-wrap">
      <div>
        <label class="text-sm font-medium">Target language</label>
        <select v-model="target" class="block rounded-lg border p-2">
          <option v-for="l in langs" :key="l" :value="l">{{ label(l) }}</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Style</label>
        <select v-model="style" class="block rounded-lg border p-2">
          <option value="neutral">Neutral</option>
          <option value="concise">Concise</option>
          <option value="formal">Formal</option>
          <option value="simple">Simple</option>
        </select>
      </div>
      <button :disabled="running || !(text && text.trim())" @click.prevent="onRun" class="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50">
        <span v-if="running" class="inline-flex items-center gap-2"><Spinner /> {{ progress || 'Processing…' }}</span>
        <span v-else>Normalize</span>
      </button>
      <ModelStatusBadge :status="badgeStatus">
        <span v-if="running">{{ progress }}</span>
        <span v-else>On-device</span>
      </ModelStatusBadge>
    </section>

    <!-- ALLTID synlig resultatruta -->
    <section class="space-y-2">
      <label class="text-sm font-medium">Result</label>
      <div class="rounded-lg border p-3 whitespace-pre-wrap min-h-24">
        {{ result || '— (no output yet)' }}
      </div>
    </section>

    <footer class="text-xs text-gray-500">
      Language detected: <strong>{{ srcLang || "—" }}</strong>. Nothing leaves your device.
    </footer>

    <!-- Mini debug-panel -->
    <details class="text-xs text-gray-500 mt-4">
      <summary>Debug</summary>
      <div>running: {{ running ? 'yes' : 'no' }}</div>
      <div>progress: {{ progress }}</div>
      <div>resultLen: {{ (result || '').length }}</div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { useNormalize } from "~/composables/useNormalize"; // explicit import
const style = ref<"neutral" | "concise" | "formal" | "simple">("neutral");

const { text, result, srcLang, langs, target, running, progress, initLangs, run } = useNormalize();

onMounted(() => { initLangs(); });

const onRun = () => {
  console.log("[page] click Normalize");
  run(target.value, style.value);
};

const badgeStatus = computed(() => (running.value ? "loading" : "ready"));

function label(code: string) {
  return ({ en: "English", de: "Deutsch", es: "Español", sv: "Svenska" } as any)[code] || code;
}
</script>
