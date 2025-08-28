import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    return {
      langs: ["en", "de", "es", "sv"],
      defaultTarget: "en",
      pivot: "en"
    };
  })
    