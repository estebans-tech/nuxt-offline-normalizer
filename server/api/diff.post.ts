import { defineEventHandler, readBody } from 'h3'
// @ts-ignore
import { diff_match_patch } from 'diff-match-patch'


export default defineEventHandler(async (event) => {
const { original = '', normalized = '' } = await readBody(event)
const dmp = new diff_match_patch()
const diffs = dmp.diff_main(original, normalized)
dmp.diff_cleanupSemantic(diffs)
const html = dmp.diff_prettyHtml(diffs)
return { html, diffs }
})