<template>
    <div class="mx-auto max-w-3xl px-6 py-10">
      <div class="rounded-2xl bg-white/90 dark:bg-slate-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 space-y-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
  
        <section class="space-y-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">On-device model</label>
          <select v-model="modelId" class="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
            <option :value="SMALL">Small – Qwen2-1.5B (fast)</option>
            <option :value="LARGE">Large – Llama-3.1-8B (quality)</option>
          </select>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Your choice is stored locally and used next time the model initializes.
          </p>
        </section>
  
        <div class="flex gap-3">
          <BaseButton @click="save">Save</BaseButton>
          <BaseButton class="bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700" @click="gpu">
            Test GPU
          </BaseButton>
        </div>
  
        <p v-if="message" class="text-sm text-slate-700 dark:text-slate-300">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { resetWebLLMEngine } from "~/composables/useWebLLMEngine.client"
  
  const SMALL = "Qwen2-1.5B-Instruct-q4f16_1-MLC"
  const LARGE = "Llama-3.1-8B-Instruct-q4f32_1-MLC"
  
  const modelId = ref<string>(SMALL)
  const message = ref("")
  
  onMounted(() => {
    const stored = localStorage.getItem("webllm:modelId")
    modelId.value = stored || SMALL
  })
  
  function save() {
    localStorage.setItem("webllm:modelId", modelId.value)
    resetWebLLMEngine()
    message.value = "Saved. The model will re-initialize on next run."
  }
  
  function gpu() {
    // quick probe
    // @ts-ignore
    const ok = !!navigator.gpu
    message.value = ok ? "WebGPU detected ✅" : "WebGPU not available ❌"
  }
  </script>
  