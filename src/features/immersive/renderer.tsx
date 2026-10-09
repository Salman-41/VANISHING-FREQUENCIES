"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { InstancedMesh, Matrix4, Vector3, Quaternion, type ShaderMaterial, type PerspectiveCamera as Camera } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sceneBudget, sceneMix, elapsedProgress, particlePositions, ridgeHeight, type SceneKind, type Quality } from "./policy";
import * as shader from "./shaders";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export type SceneCommands = { transition: (preview: boolean) => void; pulse: () => void };
type Props = {
  kind: SceneKind; quality: Quality; frame: HTMLElement;
  commands: RefObject<SceneCommands | null>; onReady: () => void; onFailure: () => void;
};

export default function Renderer(props: Props) {
  const [dpr, setDpr] = useState(0.75);
  // Canvas is entirely optional and contained by an outer React error boundary.
  return <Canvas frameloop="demand" dpr={dpr} resize={{ scroll: false, debounce: { resize: 100 } }}
    gl={{ antialias: false, alpha: false, powerPreference: "low-power", stencil: false }}
    fallback="The photograph is available without WebGL.">
    <Environment {...props} setDpr={setDpr} />
  </Canvas>;
}

function terrainBuffers(segments: number, rows: number) {
  const vertices = new Float32Array((segments + 1) * (rows + 1) * 3);
  const normals = new Float32Array(vertices.length);
  const indices = new Uint16Array(segments * rows * 6);
  const normal = new Vector3();
  for (let z = 0; z <= rows; z++) for (let x = 0; x <= segments; x++) {
    const px = x / segments * 44 - 22, pz = z / rows * 32 - 22;
    const index = (z * (segments + 1) + x) * 3;
    vertices.set([px, ridgeHeight(px, pz), pz], index);
    normal.set(ridgeHeight(px - 0.06, pz) - ridgeHeight(px + 0.06, pz), 0.12,
      ridgeHeight(px, pz - 0.06) - ridgeHeight(px, pz + 0.06)).normalize();
    normals.set(normal.toArray(), index);
    if (x < segments && z < rows) {
      const a = z * (segments + 1) + x, b = a + segments + 1;
      indices.set([a, b, a + 1, a + 1, b, b + 1], (z * segments + x) * 6);
    }
  }
  return { vertices, normals, indices };
}

function Environment({ kind, quality, frame, commands, onReady, onFailure, setDpr }: Props & { setDpr: (value: number) => void }) {
  const { gl, size, invalidate, setFrameloop } = useThree();
  const camera = useRef<Camera>(null);
  const ridges = useRef<InstancedMesh>(null);
  const terrainMaterial = useRef<ShaderMaterial>(null);
  const skyMaterial = useRef<ShaderMaterial>(null);
  const dustMaterial = useRef<ShaderMaterial>(null);
  const signal = useRef({ progress: 0.35, mix: kind === "mountain" ? 0 : 1, pulse: 1, strength: 0 });
  const ready = useEffectEvent(onReady);
  const fail = useEffectEvent(onFailure);
  const stats = useRef({ last: 0, slow: 0, samples: 0, frames: 0, dpr: 1 });
  const hints = navigator as Navigator & { deviceMemory?: number };
  const constrained = quality === "light" || (hints.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
  const budget = sceneBudget(size.width, size.height, devicePixelRatio, constrained);
  const software = useMemo(() => {
    const context = gl.getContext();
    const debug = context.getExtension("WEBGL_debug_renderer_info");
    return debug ? /swiftshader|llvmpipe|softpipe|software/i.test(String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))) : false;
  }, [gl]);
  const targetDpr = software ? Math.max(0.5, Math.min(0.75, budget.dpr, Math.sqrt(300_000 / Math.max(1, size.width * size.height)))) : budget.dpr;
  const geometry = useMemo(() => terrainBuffers(budget.segments, budget.rows), [budget.segments, budget.rows]);
  const particles = useMemo(() => particlePositions(budget.particles), [budget.particles]);
  const uniforms = useMemo(() => ({
    uMix: { value: kind === "mountain" ? 0 : 1 }, uTravel: { value: 0 },
    uPulse: { value: 1 }, uPulseStrength: { value: 0 }, uDpr: { value: 1 }, uAspect: { value: 1 }, uHeight: { value: 1 },
  }), [kind]);

  useEffect(() => {
    setDpr(targetDpr); stats.current.dpr = targetDpr;
    frame.dataset.sceneQuality = budget.particles === 80 ? "light" : "balanced";
    return () => { delete frame.dataset.sceneQuality; };
  }, [targetDpr, budget.particles, frame, setDpr]);

  useEffect(() => {
    const mesh = ridges.current;
    if (!mesh) return;
    const matrix = new Matrix4(), rotation = new Quaternion();
    for (let i = 0; i < 3; i++) {
      matrix.compose(new Vector3(i === 1 ? -9 : 0, i * 0.1, -i * 20), rotation, new Vector3(1.6 + i * 0.25, 1 + i * 0.18, 1));
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere(); invalidate();
  }, [invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const context = gl.getContext();
    if (!gl.capabilities.isWebGL2 || gl.capabilities.maxTextureSize < 2048 || context.isContextLost()) {
      fail(); return;
    }
    let alive = true;
    let readyFrame = requestAnimationFrame(() => { if (alive) ready(); });
    const lost = (event: Event) => {
      event.preventDefault();
      // Recovery is a deliberate fresh mount; no repeated automatic GPU allocation.
      if (alive) fail();
    };
    const previousShaderError = gl.debug.onShaderError;
    gl.debug.onShaderError = () => { if (alive) fail(); };
    canvas.addEventListener("webglcontextlost", lost);
    const syncDialog = () => {
      const covered = Boolean(document.querySelector("dialog[open]"));
      setFrameloop(covered ? "never" : "demand");
      if (!covered) invalidate();
    };
    const dialogObserver = new MutationObserver(syncDialog);
    dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    syncDialog();
    return () => {
      alive = false; cancelAnimationFrame(readyFrame); readyFrame = 0;
      canvas.removeEventListener("webglcontextlost", lost); dialogObserver.disconnect();
      gl.debug.onShaderError = previousShaderError;
      for (const key of ["sceneDrawCalls", "sceneTriangles", "scenePoints", "sceneTextures", "sceneGeometries", "sceneDpr", "sceneFrames", "sceneMix", "sceneProgress"]) delete frame.dataset[key];
      // R3F disposes all declarative geometries/materials and renderer on root unmount.
    };
  }, [gl, frame, invalidate, setFrameloop]);

  useGSAP(() => {
    let preview = false;
    const state = signal.current;
    let dissolve: gsap.core.Tween | undefined;
    let pulse: gsap.core.Tween | undefined;
    const trigger = ScrollTrigger.create({
      trigger: frame, start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        state.progress = self.progress;
        if (!preview) { dissolve?.kill(); state.mix = sceneMix(kind, self.progress); }
        invalidate();
      },
    });
    state.progress = trigger.progress;
    state.mix = sceneMix(kind, trigger.progress);
    const context = gsap.context(() => {});
    context.add("transition", (next: boolean) => {
      preview = next; dissolve?.kill();
      const start = performance.now(), from = state.mix;
      const target = next ? kind === "mountain" ? 1 : 0 : sceneMix(kind, state.progress);
      const ease = gsap.parseEase("power2.inOut");
      dissolve = gsap.to({ tick: 0 }, { tick: 1, duration: 0.6, ease: "none", onUpdate: () => {
        const progress = elapsedProgress(start, performance.now(), 600);
        state.mix = from + (target - from) * ease(progress);
        invalidate(); if (progress === 1) dissolve?.kill();
      }, onComplete: () => { state.mix = target; invalidate(); } });
    });
    context.add("pulse", () => {
      pulse?.kill(); state.pulse = 0; state.strength = 1;
      const start = performance.now();
      pulse = gsap.to({ tick: 0 }, { tick: 1, duration: 1.8, ease: "none", onUpdate: () => {
        state.pulse = elapsedProgress(start, performance.now(), 1800);
        state.strength = 1 - state.pulse;
        invalidate(); if (state.pulse === 1) pulse?.kill();
      }, onComplete: () => { state.pulse = 1; state.strength = 0; invalidate(); } });
    });
    commands.current = { transition: (value) => context.transition(value), pulse: () => context.pulse() };
    invalidate();
    return () => { commands.current = null; trigger.kill(); context.revert(); };
  }, { dependencies: [kind, frame, invalidate, commands], revertOnUpdate: true });

  useFrame(() => {
    const state = signal.current;
    const now = performance.now(), sample = stats.current;
    const interval = now - sample.last;
    // Only sustained, requested frames count; idle gaps are not slow frames.
    if (interval < 100 && interval > 0) {
      sample.samples++; if (interval > 28) sample.slow++;
      if (sample.samples >= 24) {
        if (sample.slow > 8 && sample.dpr > 0.5) {
          sample.dpr = Math.max(0.5, sample.dpr * 0.75); setDpr(sample.dpr);
        }
        sample.samples = 0; sample.slow = 0;
      }
    }
    sample.last = now; sample.frames++;
    const mobile = size.width < 768;
    const travel = (state.progress - 0.5) * (mobile ? 1 : 2.4);
    camera.current?.position.set(travel * 0.6, 7 - state.mix * 3.4, 19 - travel * 0.8);
    camera.current?.lookAt(travel * 0.2, 2 - state.mix * 5.2, -9);
    // R3F reconciles uniform props; mutate the live material instances, not constructor inputs.
    for (const material of [terrainMaterial.current, skyMaterial.current, dustMaterial.current]) {
      if (!material) continue;
      material.uniforms.uMix!.value = state.mix;
      material.uniforms.uTravel!.value = state.progress * 4;
      material.uniforms.uPulse!.value = state.pulse;
      material.uniforms.uPulseStrength!.value = state.strength;
      material.uniforms.uDpr!.value = gl.getPixelRatio();
      material.uniforms.uAspect!.value = size.width / Math.max(1, size.height);
      material.uniforms.uHeight!.value = gl.domElement.height;
    }
    frame.dataset.sceneDpr = gl.getPixelRatio().toFixed(2);
    frame.dataset.sceneFrames = String(sample.frames);
    frame.dataset.sceneMix = state.mix.toFixed(3);
    frame.dataset.sceneProgress = state.progress.toFixed(3);
  });

  // The particle draw is last. Read completed counters, including the first demand frame.
  const report = () => {
    frame.dataset.sceneDrawCalls = String(gl.info.render.calls);
    frame.dataset.sceneTriangles = String(gl.info.render.triangles);
    frame.dataset.scenePoints = String(gl.info.render.points);
    frame.dataset.sceneTextures = String(gl.info.memory.textures);
    frame.dataset.sceneGeometries = String(gl.info.memory.geometries);
  };

  return <>
    <PerspectiveCamera ref={camera} makeDefault fov={42} near={0.5} far={130} position={[0, 7, 19]} />
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={skyMaterial} uniforms={uniforms} vertexShader={shader.skyVertex} fragmentShader={shader.skyFragment} depthTest={false} depthWrite={false} />
    </mesh>
    <instancedMesh ref={ridges} args={[undefined, undefined, 3]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.vertices, 3]} />
        <bufferAttribute attach="attributes-normal" args={[geometry.normals, 3]} />
        <bufferAttribute attach="index" args={[geometry.indices, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={terrainMaterial} uniforms={uniforms} vertexShader={shader.terrainVertex} fragmentShader={shader.terrainFragment} />
    </instancedMesh>
    <points frustumCulled={false} onAfterRender={report}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
      <shaderMaterial ref={dustMaterial} uniforms={uniforms} vertexShader={shader.particleVertex} fragmentShader={shader.particleFragment} transparent depthWrite={false} />
    </points>
  </>;
}
