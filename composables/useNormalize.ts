import { ref } from 'vue'
const { get } = useWebLLMEngine()


async function initLangs() {
const { data } = await useFetch('/api/langs')
if (data.value) {
langs.value = data.value.langs
target.value = data.value.defaultTarget
pivot.value = data.value.pivot
} else {
langs.value = ['en','de','es','sv']
target.value = 'en'
pivot.value = 'en'
}
}


function buildPrompt(text: string, tgt = 'en', style: Style = 'neutral') {
const styleHints: Record<Style, string> = {
neutral: 'clear, standard and natural',
concise: 'clear and concise (short sentences)',
formal: 'clear and formal (professional tone)',
simple: 'clear and simple (common words, plain language)'
}
return `Rewrite the following into ${styleHints[style]} ${tgt} without changing the meaning. Avoid embellishments and keep grammar standard.


TEXT:
"""${text}"""


RESULT:`
}


async function run(tgt = target.value, style: Style = 'neutral') {
if (!input.value?.trim()) return
running.value = true
output.value = ''
progress.value = 'Detecting language…'


const detected = detectLang(input.value)
srcLang.value = detected


let working = input.value


if (detected !== 'und' && tgt && detected !== tgt) {
progress.value = `Translating ${detected} → ${tgt} (offline)…`
await initMT()
working = await translate(working, detected, tgt, pivot.value)
}


progress.value = 'Loading on-device model…'
const engine = await get()
progress.value = 'Rewriting…'


const prompt = buildPrompt(working, tgt, style)
const res = await engine.chat.completions.create({
messages: [
{ role: 'system', content: 'You rewrite text into clear, standard language.' },
{ role: 'user', content: prompt }
],
temperature: 0.2,
max_tokens: 256
})


output.value = (res?.choices?.[0]?.message?.content || '').trim()
running.value = false
}


return { input, output, srcLang, langs, target, pivot, running, progress, initLangs, run }
}