"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { audioCatalog, type Habitat } from "./catalog";
import { useAudio } from "./provider";
import { AudioEngine } from "./engine";
import styles from "./soundscapes.module.css";

const habitats: { id: Habitat; number: string; title: string; place: string; description: string }[] = [
  { id: "forest", number: "01", title: "Under the canopy", place: "California · two separate parks", description: "Water at Muir Woods and a hermit thrush at Yosemite. These recordings were made at different places and times." },
  { id: "mountain", number: "02", title: "Above the tree line", place: "Yellowstone & Denali · USA", description: "Wind at Yellowstone and a ptarmigan at Denali. This is a North American mountain study, not Himalayan field audio." },
  { id: "ocean", number: "03", title: "Edge of the ocean", place: "Olympic coast & Glacier Bay · USA", description: "Coastal surf and a humpback whale call from different parks. The surf was recorded at the surface; the whale is not a blue whale." },
];
function timestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
const createEngine = () => new AudioEngine();

export function SoundscapeExperience() {
  const { engine, state } = useAudio(createEngine);
  const [focusId, setFocusId] = useState("ocean-surf");
  const [position, setPosition] = useState(0);
  const visualRef = useRef<HTMLDivElement>(null);
  const scene = habitats.find((entry) => entry.id === state.habitat)!;
  const clips = audioCatalog.clips.filter((clip) => clip.habitat === state.habitat);
  const focus = (clips.find((clip) => clip.id === focusId) ?? clips[0])!;
  const isPlaying = state.status === "playing";

  useEffect(() => {
    // Reflect stop, seek, focus changes and paused positions as well as active playback.
    const syncPosition = () => setPosition(engine.position(focus.durationSeconds));
    syncPosition();
    if (!isPlaying) return;
    const timer = window.setInterval(syncPosition, 250);
    return () => window.clearInterval(timer);
  }, [engine, focus.durationSeconds, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;
    let last = 0;
    const update = (now: number) => {
      frame = requestAnimationFrame(update);
      if (now - last < 90) return;
      last = now;
      const values = engine.sample();
      if (!values || !visualRef.current) return;
      const energy = values.slice(1, 48).reduce((sum, value) => sum + value, 0) / (47 * 255);
      visualRef.current.style.setProperty("--energy", String(Math.min(1, energy * 2.4)));
    };
    const syncVisuals = () => {
      cancelAnimationFrame(frame);
      visualRef.current?.style.setProperty("--energy", "0");
      if (document.documentElement.dataset.motion !== "reduced" && document.documentElement.dataset.media !== "lighter")
        frame = requestAnimationFrame(update);
    };
    const observer = new MutationObserver(syncVisuals);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-media"] });
    syncVisuals();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      visualRef.current?.style.setProperty("--energy", "0");
    };
  }, [engine, isPlaying, focus.durationSeconds]);
  useEffect(() => () => engine.stop("idle"), [engine]);

  const chooseHabitat = (habitat: Habitat) => {
    engine.selectHabitat(habitat);
    setFocusId(audioCatalog.clips.find((clip) => clip.habitat === habitat && clip.kind === "ambience")!.id);
    setPosition(0);
  };
  return (
    <section className={styles.experience} aria-labelledby="soundscape-heading">
      <div className={styles.topline}>
        <p className="eyebrow" id="soundscape-heading">Listening room / field archive</p>
        <p>01 — 03 / independent recordings</p>
      </div>
      <div className={styles.selector} role="group" aria-label="Choose a habitat">
        {habitats.map((habitat) => (
          <button key={habitat.id} type="button" aria-pressed={habitat.id === state.habitat} onClick={() => chooseHabitat(habitat.id)} className={styles.habitatButton}>
            <span>{habitat.number}</span><strong>{habitat.title}</strong><small>{habitat.place}</small>
          </button>
        ))}
      </div>
      <div className={`${styles.scene} ${styles[state.habitat]}`} ref={visualRef}>
        <div className={styles.sceneArt} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.sceneCopy}>
          <p className="eyebrow">{scene.number} / {state.habitat}</p>
          <h2>{scene.title}<span className={styles.period}>.</span></h2>
          <p>{scene.description}</p>
        </div>
        <div className={styles.liveMeter} aria-hidden="true"><span /><span /><span /><span /><span /></div>
      </div>
      <div className={styles.console}>
        <div className={styles.transport}>
          <div>
            <p className="eyebrow">Playback / explicit consent</p>
            <h3 aria-live="polite" aria-atomic="true">{isPlaying ? "Listening now" : state.status === "loading" ? "Preparing recordings" : state.status === "paused" ? "Listening paused" : "Listen when ready"}</h3>
            <p className={styles.micro}>Locally cached MP3s begin only after you choose Sound on. Independent clips loop at their original speed; the blend is an artistic composition, not one measured soundscape.</p>
          </div>
          <div className={styles.transportControls}>
            <button type="button" className={styles.playButton} disabled={state.status === "loading" || state.enabled.length === 0} onClick={() => isPlaying ? engine.stop("idle") : void engine.start()} aria-label={isPlaying ? "Stop audio" : state.status === "loading" ? "Loading…" : state.status === "paused" ? "Resume audio ↗" : "Sound on ↗"}>
              {isPlaying ? "Stop audio" : state.status === "loading" ? "Loading…" : state.status === "paused" ? "Resume audio ↗" : "Sound on ↗"}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={engine.toggleMute} aria-pressed={state.muted}>{state.muted ? "Unmute" : "Mute"}</button>
            <label className={styles.volume}>Volume <input type="range" min="0" max="100" value={Math.round(state.volume * 100)} onChange={(event) => engine.setVolume(Number(event.target.value) / 100)} aria-label="Soundscape volume" /> <output>{Math.round(state.volume * 100)}%</output></label>
          </div>
        </div>
        {state.error && <p className={styles.error} role="alert">{state.error} You can still read the recording descriptions and credits below.</p>}
        {state.enabled.length === 0 && <p className={styles.empty} role="status">Both layers are off. Enable a layer to listen.</p>}
        <div className={styles.waveformPanel}>
          <div className={styles.waveformHeader}><span>Waveform / {focus.title}</span><span>relative amplitude · not calibrated sound level</span></div>
          <div className={styles.waveform} aria-hidden="true">{focus.waveformPeaks.map((peak, index) => <span key={index} style={{ "--peak": Math.max(0.08, peak) } as CSSProperties} />)}</div>
          <label className={styles.seek}>Seek within looping recording <input type="range" min="0" max={Math.floor(focus.durationSeconds * 10)} value={Math.min(Math.floor(position * 10), Math.floor(focus.durationSeconds * 10))} onChange={(event) => { const seconds = Number(event.target.value) / 10; setPosition(seconds); engine.seek(seconds, focus.id); }} aria-valuetext={`${timestamp(position)} of ${timestamp(focus.durationSeconds)}`} /></label>
          <p className={styles.micro}>Seeking moves the composition clock. Each enabled layer loops at its own length.</p>
          <div className={styles.time}><span>{timestamp(position)}</span><span>{timestamp(focus.durationSeconds)}</span></div>
        </div>
        <div className={styles.layers}>
          <div><p className="eyebrow">Composition desk</p><h3>Choose what you hear.</h3><p>Each layer comes from its own archival recording. Toggle or select a layer to read its waveform and provenance.</p></div>
          {clips.map((clip) => (
            <div className={styles.layer} key={clip.id}>
              <label><input type="checkbox" checked={state.enabled.includes(clip.id)} onChange={() => engine.toggleLayer(clip.id)} /><span><b>{clip.title}</b><small>{clip.kind} · {clip.place}</small></span></label>
              <button type="button" aria-label={`View waveform for ${clip.title}`} aria-pressed={focus.id === clip.id} onClick={() => setFocusId(clip.id)}>View waveform</button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.provenance}>
        <div><p className="eyebrow">Archive notes</p><h2>Every voice has a source.</h2><p>These recordings are examples from U.S. national parks. They do not recreate the exact habitat or species encounters in the documentary. Recording dates are shown only where the archive provides one.</p></div>
        <div className={styles.credits}>{clips.map((clip) => (
          <article key={clip.id}>
            <p className="eyebrow">{clip.kind} / {clip.format} / {timestamp(clip.durationSeconds)}</p>
            <h3>{clip.title}</h3><p>{clip.description}</p>
            <dl><div><dt>Recorded at</dt><dd>{clip.place}</dd></div><div><dt>Capture date</dt><dd>{clip.capturedOn ?? "Not reported"}</dd></div><div><dt>Creator / credit</dt><dd>{clip.creator}</dd></div><div><dt>Local processing</dt><dd>{clip.processing}</dd></div></dl>
            <p><a href={clip.sourcePage} target="_blank" rel="noreferrer">NPS recording page ↗</a> · <a href={clip.licensePage} target="_blank" rel="noreferrer">NPS reuse terms ↗</a></p>
          </article>
        ))}</div>
      </div>
      <noscript>
        <style>{`.${styles.selector},.${styles.transportControls},.${styles.seek},.${styles.layer} button,.${styles.layer} input{display:none}`}</style>
      </noscript>
      <p className={styles.micro}>Audio controls require JavaScript and an explicit play action. Archive descriptions and the full recording register in <a href="/credits">Credits</a> remain available without sound.</p>
    </section>
  );
}
