import { audioCatalog, type AudioClip, type Habitat } from "./catalog";

export type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type AudioSnapshot = Readonly<{
  habitat: Habitat;
  status: AudioStatus;
  enabled: readonly string[];
  volume: number;
  muted: boolean;
  error: string | null;
  duration: number;
}>;
type Voice = { source: AudioBufferSourceNode; gain: GainNode };

const initial: AudioSnapshot = {
  habitat: "ocean", status: "idle", enabled: ["ocean-surf", "ocean-humpback"],
  volume: 0.65, muted: false, error: null, duration: 6.627,
};

/** Owns the sole AudioContext. Nothing is fetched or played until start() is called by a user gesture. */
export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private voices: Voice[] = [];
  private buffers = new Map<string, AudioBuffer>();
  private abort: AbortController | null = null;
  private ticket = 0;
  private listeners = new Set<() => void>();
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private snapshot: AudioSnapshot = initial;
  private startedAt = 0;
  private offset = 0;
  private disposed = false;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => initial;
  private publish(next: Partial<AudioSnapshot>) {
    this.snapshot = { ...this.snapshot, ...next };
    this.listeners.forEach((listener) => listener());
  }
  private getSelected(): AudioClip[] {
    return audioCatalog.clips.filter((clip) => clip.habitat === this.snapshot.habitat && this.snapshot.enabled.includes(clip.id));
  }
  private ensureContext() {
    if (this.context) return this.context;
    if (typeof AudioContext === "undefined") throw new Error("Web Audio is unavailable in this browser.");
    const ctx = new AudioContext();
    const master = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    master.gain.value = this.snapshot.muted ? 0 : this.snapshot.volume;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    this.context = ctx;
    this.master = master;
    this.analyser = analyser;
    return ctx;
  }
  private async getBuffer(clip: AudioClip, signal: AbortSignal): Promise<AudioBuffer> {
    const cached = this.buffers.get(clip.id);
    if (cached) return cached;
    const response = await fetch(clip.localPath, { signal, cache: "force-cache" });
    if (!response.ok) throw new Error(`${clip.title} could not be loaded (${response.status}).`);
    const encoded = await response.arrayBuffer();
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const decoded = await this.ensureContext().decodeAudioData(encoded);
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    this.buffers.set(clip.id, decoded);
    return decoded;
  }
  private retire(voices: Voice[], fade = 0.42) {
    const ctx = this.context;
    if (!ctx) return;
    for (const voice of voices) {
      voice.gain.gain.cancelScheduledValues(ctx.currentTime);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, ctx.currentTime);
      voice.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
      const timer = setTimeout(() => {
        try { voice.source.stop(); } catch { /* Already stopped. */ }
        voice.source.disconnect();
        voice.gain.disconnect();
        this.timers.delete(timer);
      }, fade * 1000 + 60);
      this.timers.add(timer);
    }
  }
  private async play(offset = 0) {
    if (this.disposed || typeof document === "undefined" || document.hidden) return;
    const request = ++this.ticket;
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;
    const clips = this.getSelected();
    if (!clips.length) { this.stop("idle"); return; }
    this.publish({ status: "loading", error: null });
    try {
      // resume() begins in the click/key handler before the first await.
      const ctx = this.ensureContext();
      await ctx.resume();
      const buffers = await Promise.all(clips.map((clip) => this.getBuffer(clip, abort.signal)));
      if (request !== this.ticket || this.disposed || document.hidden) return;
      const fresh: Voice[] = [];
      for (let i = 0; i < clips.length; i++) {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffers[i]!;
        source.loop = true; // Explicitly disclosed in the interface.
        source.playbackRate.value = 1;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.78 / clips.length, ctx.currentTime + 0.42);
        source.connect(gain);
        gain.connect(this.master!);
        source.start(0, offset % buffers[i]!.duration);
        fresh.push({ source, gain });
      }
      this.retire(this.voices);
      this.voices = fresh;
      this.offset = offset;
      this.startedAt = ctx.currentTime;
      this.publish({ status: "playing", duration: clips.find((clip) => clip.kind === "ambience")?.durationSeconds ?? clips[0]!.durationSeconds });
    } catch (error) {
      if (request !== this.ticket || abort.signal.aborted) return;
      const message = error instanceof Error ? error.message : "Audio could not start.";
      this.retire(this.voices, 0.08);
      this.voices = [];
      this.publish({ status: "error", error: message });
    }
  }
  start = () => this.play(this.offset);
  selectHabitat = (habitat: Habitat) => {
    if (habitat === this.snapshot.habitat) return;
    const enabled = audioCatalog.clips.filter((clip) => clip.habitat === habitat).map((clip) => clip.id);
    const wasPlaying = this.snapshot.status === "playing" || this.snapshot.status === "loading";
    this.publish({ habitat, enabled, duration: audioCatalog.clips.find((clip) => clip.habitat === habitat && clip.kind === "ambience")!.durationSeconds, error: null });
    if (wasPlaying) void this.play(0);
    else this.stop("idle");
  };
  toggleLayer = (id: string) => {
    if (!audioCatalog.clips.some((clip) => clip.id === id && clip.habitat === this.snapshot.habitat)) return;
    const enabled = this.snapshot.enabled.includes(id) ? this.snapshot.enabled.filter((item) => item !== id) : [...this.snapshot.enabled, id];
    const wasPlaying = this.snapshot.status === "playing" || this.snapshot.status === "loading";
    this.publish({ enabled });
    if (wasPlaying) void this.play(this.position());
  };
  setVolume = (value: number) => {
    const volume = Math.max(0, Math.min(1, value));
    this.publish({ volume });
    if (this.context && this.master)
      this.master.gain.setTargetAtTime(this.snapshot.muted ? 0 : volume, this.context.currentTime, 0.08);
  };
  toggleMute = () => {
    const muted = !this.snapshot.muted;
    this.publish({ muted });
    if (this.context && this.master)
      this.master.gain.setTargetAtTime(muted ? 0 : this.snapshot.volume, this.context.currentTime, 0.08);
  };
  position = (period = this.snapshot.duration) => {
    if (!this.context || this.snapshot.status !== "playing") return this.offset % period;
    return (this.offset + this.context.currentTime - this.startedAt) % period;
  };
  seek = (seconds: number) => {
    const at = Math.max(0, Math.min(this.snapshot.duration, seconds));
    this.offset = at;
    if (this.snapshot.status === "playing") void this.play(at);
  };
  sample = () => {
    if (!this.analyser || this.snapshot.status !== "playing") return null;
    const bins = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(bins);
    return bins;
  };
  stop = (status: AudioStatus = "paused") => {
    ++this.ticket;
    this.abort?.abort();
    this.abort = null;
    this.retire(this.voices, 0.18);
    this.voices = [];
    this.offset = 0;
    this.publish({ status, error: null });
    const ctx = this.context;
    if (ctx) {
      const timer = setTimeout(() => {
        if (this.snapshot.status !== "playing" && this.snapshot.status !== "loading") void ctx.suspend();
        this.timers.delete(timer);
      }, 300);
      this.timers.add(timer);
    }
  };
  pause = () => {
    if (this.snapshot.status !== "playing" && this.snapshot.status !== "loading") return;
    const at = this.position();
    this.stop("paused");
    this.offset = at;
  };
  handleVisibility = () => { if (document.hidden) this.pause(); };
  leavePage = () => {
    const active = [...this.voices];
    this.stop("idle");
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    for (const voice of active) {
      try { voice.source.stop(); } catch { /* Already stopped. */ }
      voice.source.disconnect();
      voice.gain.disconnect();
    }
    this.buffers.clear();
    void this.context?.close();
    this.context = null;
    this.master = null;
    this.analyser = null;
  };
  dispose = () => {
    if (this.disposed) return;
    this.leavePage();
    this.disposed = true;
    this.listeners.clear();
  };
}
