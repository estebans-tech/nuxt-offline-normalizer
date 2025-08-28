import { ref } from 'vue'
import type { Ref } from 'vue'
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm'


let _enginePromise: Promise<any> | null = null


export const useWebLLMEngine = () => {
const ready: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)


if (!_enginePromise) {
const config = useRuntimeConfig()
const modelId = config.public.webllmModelId || 'Phi-3-mini-4k-instruct-q4f16_1'


_enginePromise = (async () => {
try {
const engine = await CreateWebWorkerMLCEngine(modelId, {
initProgressCallback: (p: any) => {
// console.log('WebLLM init:', p)
}
})
ready.value = true
return engine
} catch (e: any) {
error.value = e?.message || String(e)
throw e
}
})()
}


const get = async () => _enginePromise!


return { get, ready, error }
}