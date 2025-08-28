<template>
    <div class="mx-auto max-w-3xl px-6 py-10">
      <div class="rounded-2xl bg-white/90 dark:bg-slate-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 space-y-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">About</h2>
        <p class="text-slate-700 dark:text-slate-300">
          This app rewrites “odd” sentences into clear, standard language — fully on your device.
          It uses an on-device LLM (WebLLM) and an offline translator for en/de/es/sv.
        </p>
        <ul class="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
          <li>No external APIs; nothing leaves your device.</li>
          <li>Models: Qwen2-1.5B (fast) or Llama-3.1-8B (higher quality).</li>
          <li>Deployed on Netlify; open source on GitHub.</li>
        </ul>
      </div>
    </div>
  </template>
  