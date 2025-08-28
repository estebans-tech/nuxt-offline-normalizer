export default defineEventHandler(() => {
    const config = useRuntimeConfig()
    const langs = config.public.supportedLangs || ['en','de','es','sv']
    return {
    langs,
    defaultTarget: config.public.defaultTargetLang || 'en',
    pivot: config.public.pivotLang || 'en'
    }
    })