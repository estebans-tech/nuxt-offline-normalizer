/// <reference lib="webworker" />
import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();

// Worker entrypoint: skicka vidare alla meddelanden till WebLLM-handlern
self.onmessage = (evt) => handler.onmessage(evt);

// (valfritt) markera filen som ESM-modul för att undvika globala krockar i vissa toolchains
export {};