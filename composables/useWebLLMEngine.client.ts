import { CreateWebWorkerMLCEngine, CreateMLCEngine } from "@mlc-ai/web-llm"

let _enginePromise: Promise<any> | null = null

function onProgress(p: any, set: (s: string)=>void) {
  try {
    const pct = Math.round((p?.progress ?? p?.percent ?? 0) * 100)
    const stage = p?.text || p?.status || p?.stage || ""
    set(pct ? `${pct}% ${stage}` : stage || "Loading model…")
  } catch { set("Loading model…") }
}

async function createWorker(modelId: string, set: (s: string)=>void) {
  const worker = new Worker(new URL("../workers/webllm.worker.ts", import.meta.url), { type: "module" })
  return await CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: (p: any) => onProgress(p, set) })
}
async function createInline(modelId: string, set: (s: string)=>void) {
  return await CreateMLCEngine(modelId, { initProgressCallback: (p: any) => onProgress(p, set) })
}
function withTimeout<T>(p: Promise<T>, ms = 30000) {
  return Promise.race([p, new Promise<never>((_, rej)=> setTimeout(()=> rej(new Error("Engine init timeout")), ms))])
}

export function useWebLLMEngine() {
  const ready = ref(false)
  const error = ref<string | null>(null)
  const progressText = ref("")

  const get = async () => {
    if (!import.meta.client) throw new Error("WebLLM can only init in browser.")
    if (_enginePromise) return _enginePromise

    const stored = localStorage.getItem("webllm:modelId")
    const fallback = (import.meta.env.VITE_WEBLLM_MODEL_ID as string) || "Qwen2-1.5B-Instruct-q4f16_1-MLC"
    const modelId = stored || fallback

    _enginePromise = (async () => {
      try {
        if (typeof Worker !== "undefined") {
          try {
            const e = await withTimeout(createWorker(modelId, (s)=> progressText.value = s), 30000)
            ready.value = true
            return e
          } catch (e) { console.warn("[WebLLM] worker failed, fallback → inline", e) }
        }
        const e = await withTimeout(createInline(modelId, (s)=> progressText.value = s), 30000)
        ready.value = true
        return e
      } catch (e: any) { error.value = e?.message || String(e); throw e }
    })()

    return _enginePromise
  }

  return { get, ready, error, progressText }
}

export function resetWebLLMEngine() {
  _enginePromise = null
}
