// composables/useNormalize.ts
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useLangDetect } from "./useLangDetect";
import { useOfflineTranslate } from "./useOfflineTranslate";

export type Style = "neutral" | "concise" | "formal" | "simple";

export function useNormalize() {
  // Byt namn: "text" och "result" för att undvika tvetydighet i templates
  const text: Ref<string> = ref("");
  const result: Ref<string> = ref("");
  const running: Ref<boolean> = ref(false);
  const progress: Ref<string> = ref("");
  const srcLang: Ref<string | null> = ref(null);

  const langs: Ref<string[]> = ref([]);
  const target: Ref<string> = ref("en");
  const pivot: Ref<string> = ref("en");

  const { detectLang } = useLangDetect();
  const { init: initMT, translate } = useOfflineTranslate();

  async function initLangs() {
    const defaults = ["en", "de", "es", "sv"];
    if (import.meta.client) {
      try {
        const res = await fetch("/api/langs");
        if (res.ok) {
          const d: any = await res.json();
          langs.value = d.langs || defaults;
          target.value = d.defaultTarget || "en";
          pivot.value = d.pivot || "en";
          return;
        }
      } catch { /* noop */ }
    }
    langs.value = defaults;
    target.value = "en";
    pivot.value = "en";
  }

  function buildPrompt(raw: string, tgt = "en", style: Style = "neutral") {
    const styleHints: Record<Style, string> = {
      neutral: "clear, standard and natural",
      concise: "clear and concise (short sentences)",
      formal: "clear and formal (professional tone)",
      simple: "clear and simple (common words, plain language)",
    };
    return `Rewrite the following into ${styleHints[style]} ${tgt} without changing the meaning. Avoid embellishments and keep grammar standard.

TEXT:
"""${raw}"""

RESULT:`;
  }

  async function run(tgt = target.value, style: Style = "neutral") {
    if (!import.meta.client) {
      console.warn("[normalize] run called on server; ignoring.");
      return;
    }
    console.log("[normalize] onRun clicked; text length =", (text.value || "").length);

    if (!text.value?.trim()) {
      progress.value = "Nothing to do (empty input).";
      return;
    }

    running.value = true;
    result.value = "";
    progress.value = "Detecting language…";

    try {
      const detected = detectLang(text.value);
      srcLang.value = detected;

      let working = text.value;
      if (detected !== "und" && tgt && detected !== tgt) {
        progress.value = `Translating ${detected} -> ${tgt} (offline)…`;
        await initMT();
        working = await translate(working, detected, tgt, pivot.value);
      }

      // Ladda WebLLM endast på klient (dynamiskt)
      const { useWebLLMEngine } = await import("./useWebLLMEngine.client");
      const { get, progressText } = useWebLLMEngine();

      const stop = watch(
        progressText,
        (v) => {
          if (running.value) progress.value = v || "Loading on-device model…";
        },
        { immediate: true }
      );

      const engine = await get();
      stop();

      progress.value = "Rewriting…";
      const prompt = buildPrompt(working, tgt, style);
      const res = await engine.chat.completions.create({
        messages: [
          { role: "system", content: "You rewrite text into clear, standard language." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 256,
      });

      const out = res?.choices?.[0]?.message?.content || "";
      result.value = out.trim();
      console.log("[normalize] done; result length =", result.value.length);
    } catch (e: any) {
      console.error("[normalize] error:", e);
      progress.value = e?.message || "Failed. See console.";
    } finally {
      running.value = false;
    }
  }

  return { text, result, srcLang, langs, target, pivot, running, progress, initLangs, run };
}
