// composables/useNormalize.ts
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useLangDetect } from "./useLangDetect";
import { useOfflineTranslate } from "./useOfflineTranslate";

export type Style = "neutral" | "concise" | "formal" | "simple";

export function useNormalize() {
  const text: Ref<string> = ref("");
  const result: Ref<string> = ref("");
  const running: Ref<boolean> = ref(false);
  const progress: Ref<string> = ref("");
  const srcLang: Ref<string | null> = ref(null);

  // vi behåller interna states, men UI låter dig inte ändra dem
  const langs: Ref<string[]> = ref(["en", "de", "es", "sv"]);
  const target: Ref<string> = ref("en");   // ← engelska default
  const pivot: Ref<string> = ref("en");

  const { detectLang } = useLangDetect();
  const { init: initMT, translate } = useOfflineTranslate();

  async function initLangs() {
    // vi kan skippa fetch och bara sätta default
    langs.value = ["en", "de", "es", "sv"];
    target.value = "en";
    pivot.value = "en";
  }

  function buildPrompt(raw: string, tgt = "en", style: Style = "simple") {
    const styleHints: Record<Style, string> = {
      neutral: "clear, standard and natural",
      concise: "clear and concise (short sentences)",
      formal: "clear and formal (professional tone)",
      simple: "clear and simple (common words, plain language)", // ← används
    };
    return `Rewrite the following into ${styleHints[style]} ${tgt} without changing the meaning. Avoid embellishments and keep grammar standard.

TEXT:
"""${raw}"""

RESULT:`;
  }

  async function run(tgt = "en", style: Style = "simple") { // ← default
    if (!import.meta.client) return;
    if (!text.value?.trim()) return;

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

      const { useWebLLMEngine } = await import("./useWebLLMEngine.client");
      const { get, progressText } = useWebLLMEngine();

      const stop = watch(
        progressText,
        (v) => { if (running.value) progress.value = v || "Loading on-device model…"; },
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
    } catch (e: any) {
      console.error("[normalize] error:", e);
      progress.value = e?.message || "Failed. See console.";
    } finally {
      running.value = false;
    }
  }

  return { text, result, srcLang, langs, target, pivot, running, progress, initLangs, run };
}
