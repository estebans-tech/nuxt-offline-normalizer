// composables/useWebLLMEngine.client.ts
import { ref } from "vue";
import type { Ref } from "vue";
import { CreateWebWorkerMLCEngine, CreateMLCEngine } from "@mlc-ai/web-llm";

let _enginePromise: Promise<any> | null = null;

export function useWebLLMEngine() {
  const ready: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const progressText: Ref<string> = ref("");

  function onProgress(p: any) {
    try {
      const pct = Math.round((p?.progress ?? p?.percent ?? 0) * 100);
      const stage = p?.text || p?.status || p?.stage || "";
      progressText.value = pct ? `${pct}% ${stage}` : stage || "Loading model…";
    } catch {
      progressText.value = "Loading model…";
    }
  }

  async function createWorkerEngine(modelId: string) {
    const worker = new Worker(
      new URL("../workers/webllm.worker.ts", import.meta.url),
      { type: "module" }
    );
    return await CreateWebWorkerMLCEngine(worker, modelId, {
      initProgressCallback: onProgress,
    });
  }

  async function createInlineEngine(modelId: string) {
    return await CreateMLCEngine(modelId, { initProgressCallback: onProgress });
  }

  function withTimeout<T>(p: Promise<T>, ms = 45000) {
    return Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Engine init timeout")), ms)
      ),
    ]);
  }

  const get = async () => {
    if (!import.meta.client) {
      throw new Error("WebLLM can only initialize in the browser.");
    }
    if (_enginePromise) return _enginePromise;

    // Läs modell-id från Vite env (ingen Nuxt-alias!)
    const modelId =
      (import.meta.env.VITE_WEBLLM_MODEL_ID as string) ||
      "Qwen2-1.5B-Instruct-q4f16_1-MLC";

    _enginePromise = (async () => {
      try {
        // Försök worker först (bäst UX), fallet tillbaka till inline om det inte funkar.
        if (typeof Worker !== "undefined") {
          try {
            const engine = await withTimeout(createWorkerEngine(modelId), 30000);
            ready.value = true;
            return engine;
          } catch (e) {
            console.warn("[WebLLM] Worker init failed, falling back to inline:", e);
          }
        }
        const engine = await withTimeout(createInlineEngine(modelId), 30000);
        ready.value = true;
        return engine;
      } catch (e: any) {
        error.value = e?.message || String(e);
        throw e;
      }
    })();

    return _enginePromise!;
  };

  return { get, ready, error, progressText };
}
