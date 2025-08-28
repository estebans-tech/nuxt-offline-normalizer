import { franc } from 'franc-min'


export function useLangDetect() {
function detectLang(text: string, fallback = 'und') {
try { return franc(text || '', { minLength: 10 }) || fallback } catch { return fallback }
}
return { detectLang }
}