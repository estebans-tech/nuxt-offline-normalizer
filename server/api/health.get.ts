import { defineEventHandler } from 'h3'

export default defineEventHandler(() => ({ status: 'ok', ts: Date.now() }))