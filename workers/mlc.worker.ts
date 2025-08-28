import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// Minimal bridge so the engine can talk to the Worker.
const handler = new WebWorkerMLCEngineHandler();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).onmessage = (evt: MessageEvent) => {
  handler.onmessage(evt);
};