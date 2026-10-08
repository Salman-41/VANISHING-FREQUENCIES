import { AssetCandidateSchema, type AssetCandidate } from "../../../data/schemas/species.schema";

export function requireClearedAudio(input: unknown): AssetCandidate {
  const asset = AssetCandidateSchema.parse(input);
  if (asset.kind !== "audio" || !asset.acquired || !asset.clearedForUse || asset.verification !== "item-license-verified" || asset.commercialUse !== "permitted-with-conditions") throw new Error("Recording has not been acquired and cleared for playback");
  return asset;
}

/** Client-only feature interface. Call start inside an explicit user gesture.
 * Future players must supply a reviewed local file, descriptive equivalent and credit.
 * No context, request, microphone or oscillator is created on import. */
export function createAudioSession() {
  let context: AudioContext | null = null;
  let source: AudioBufferSourceNode | null = null;
  let controller: AbortController | null = null;
  let generation = 0;
  const stop = () => { generation++; controller?.abort(); controller = null; source?.stop(); source?.disconnect(); source = null; void context?.suspend(); };
  const hidden = () => { if (document.hidden) stop(); };
  document.addEventListener("visibilitychange", hidden);
  return {
    async start(input: unknown, localPath: string) {
      const asset = requireClearedAudio(input);
      if (!/^\/audio\/[a-zA-Z0-9/_-]+\.(mp3|ogg|wav)$/.test(localPath)) throw new Error("Audio requires an acquired local path");
      stop(); const ticket = generation;
      context ??= new AudioContext(); await context.resume();
      if (ticket !== generation || document.hidden) return;
      controller = new AbortController();
      try {
        const response = await fetch(localPath, { signal: controller.signal });
        if (!response.ok) throw new Error("Recording could not be loaded");
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        if (ticket !== generation || document.hidden) return;
        source = context.createBufferSource(); source.buffer = buffer;
        // Local file is played at native rate. Any source transformation needs visible disclosure.
        source.playbackRate.value = 1; source.connect(context.destination); source.start();
        return asset;
      } catch (error) { if (ticket === generation) { stop(); throw error; } }
    },
    stop,
    dispose() { stop(); document.removeEventListener("visibilitychange", hidden); void context?.close(); context = null; },
  };
}
