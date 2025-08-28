// Only en, de, es, sv for now. Extensible later via runtimeConfig.
export type LangCode = 'en' | 'de' | 'es' | 'sv' | string


let bergamotReady = false
// let mod: any // your wasm module instance


// Direct pairs we plan to ship first (optimize for size):
// en<->de, en<->es, en<->sv
const DIRECT: Record<string, boolean> = {
'en-de': true, 'de-en': true,
'en-es': true, 'es-en': true,
'en-sv': true, 'sv-en': true,
}


export function useOfflineTranslate() {
async function init() {
if (bergamotReady) return
try {
// Example bootstrap (replace with your real wasm wiring):
// mod = await import(/* @vite-ignore */ '/bergamot/bootstrap.js')
// await mod.init({ basePath: '/bergamot/' })
// await mod.load('en-de'); await mod.load('en-es'); await mod.load('en-sv');
bergamotReady = true
} catch (e) {
console.warn('Bergamot init failed; falling back to identity translation.', e)
bergamotReady = false
}
}


async function translateDirect(text: string, src: LangCode, tgt: LangCode) {
// if (!mod) return text
// return await mod.translate(text, { src, tgt })
return text
}


async function translate(text: string, src: LangCode, tgt: LangCode, pivot: LangCode = 'en') {
if (!text || src === tgt) return text
if (!bergamotReady) return text


const key = `${src}-${tgt}`
if (DIRECT[key]) return translateDirect(text, src, tgt)


// Pivot via English: src -> pivot -> tgt
const toPivot = DIRECT[`${src}-${pivot}`] ? await translateDirect(text, src, pivot) : text
const fromPivot = DIRECT[`${pivot}-${tgt}`] ? await translateDirect(toPivot, pivot, tgt) : toPivot
return fromPivot
}


return { init, translate }
}