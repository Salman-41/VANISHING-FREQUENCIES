// Original interpretive shaders. No elevation, acoustic, or population data enters these programs.
export const terrainVertex = /* glsl */ `
uniform float uMix;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;
void main() {
  vec4 p = instanceMatrix * vec4(position, 1.0);
  p.y = p.y * (1.0 - uMix * 0.86) - uMix * 5.0;
  vec4 world = modelMatrix * p;
  vWorld = world.xyz;
  vNormal = normalize(normalMatrix * normal);
  vec4 view = viewMatrix * world;
  vDepth = -view.z;
  gl_Position = projectionMatrix * view;
}`;

export const terrainFragment = /* glsl */ `
uniform float uMix;
uniform float uTravel;
uniform float uPulse;
uniform float uPulseStrength;
uniform float uHeight;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;
void main() {
  float light = 0.25 + 0.75 * max(dot(normalize(vNormal), normalize(vec3(-0.6, 0.8, 0.3))), 0.0);
  float height = vWorld.y + uMix * 5.0;
  float snow = smoothstep(3.2, 5.5, height) * smoothstep(0.2, 0.8, vNormal.y);
  vec3 rock = mix(vec3(0.034, 0.053, 0.048), vec3(0.50, 0.54, 0.50), snow) * light;
  float band = abs(fract(height * 2.3) - 0.5);
  float contour = 1.0 - smoothstep(0.0, max(fwidth(height * 2.3) * 1.3, 0.025), band);
  rock += contour * 0.024 * (1.0 - snow);
  vec2 uv = vWorld.xz * 0.35;
  float wave = sin(uv.x + sin(uv.y * 1.7 + uTravel)) + sin(uv.y - uv.x * 0.7 - uTravel);
  float caustic = pow(max(0.0, 1.0 - abs(wave)), 7.0);
  vec3 sea = vec3(0.018, 0.085, 0.095) * (0.7 + light) + caustic * vec3(0.024, 0.075, 0.075);
  float ring = 1.0 - smoothstep(0.0, 0.25, abs(length(vWorld.xz - vec2(0.0, -8.0)) - uPulse * 26.0));
  sea += ring * uPulseStrength * vec3(0.08, 0.18, 0.18);
  float screenY = gl_FragCoord.y / max(1.0, uHeight);
  vec3 seaFog = mix(vec3(0.003, 0.015, 0.023), vec3(0.028, 0.11, 0.13), screenY);
  vec3 fogColor = mix(vec3(0.15, 0.20, 0.18), seaFog, uMix);
  float fog = 1.0 - exp(-max(0.0, vDepth - 9.0) * mix(0.027, 0.15, uMix));
  gl_FragColor = vec4(mix(mix(rock, sea, uMix), fogColor, fog), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const skyVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }
`;
export const skyFragment = /* glsl */ `
uniform float uMix;
uniform float uTravel;
uniform float uPulse;
uniform float uPulseStrength;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vec3 mountain = mix(vec3(0.17, 0.22, 0.20), vec3(0.012, 0.029, 0.033), smoothstep(0.1, 1.0, vUv.y));
  float shaft = pow(max(0.0, sin((vUv.x + vUv.y * 0.17) * 24.0 + uTravel * 0.25)), 12.0);
  vec3 ocean = mix(vec3(0.003, 0.015, 0.023), vec3(0.028, 0.11, 0.13), vUv.y);
  ocean += shaft * smoothstep(0.15, 1.0, vUv.y) * vec3(0.011, 0.024, 0.023);
  vec2 radial = (vUv - vec2(0.5, 0.52)) * vec2(uAspect, 1.0);
  float ring = 1.0 - smoothstep(0.0, 0.008, abs(length(radial) - uPulse * 1.2));
  ocean += ring * uPulseStrength * vec3(0.055, 0.12, 0.12);
  // A feathered horizontal waterline carries the editorial aperture into the next environment.
  float waterline = smoothstep(vUv.y - 0.16, vUv.y + 0.16, uMix * 1.32 - 0.16);
  gl_FragColor = vec4(mix(mountain, ocean, waterline), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export const particleVertex = /* glsl */ `
uniform float uTravel;
uniform float uMix;
uniform float uDpr;
varying float vFade;
void main() {
  vec3 p = position;
  p.x += sin(p.z + uTravel * 0.4) * 0.15;
  p.y -= uTravel * mix(0.24, 0.06, uMix);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(35.0 / max(1.0, -mv.z), 1.0, 2.4) * uDpr;
  vFade = smoothstep(0.0, 4.0, -mv.z) * (1.0 - smoothstep(25.0, 55.0, -mv.z));
}`;
export const particleFragment = /* glsl */ `
uniform float uMix;
varying float vFade;
void main() {
  float dotShape = 1.0 - smoothstep(0.15, 0.5, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(mix(vec3(0.85, 0.87, 0.82), vec3(0.34, 0.55, 0.54), uMix), dotShape * vFade * 0.5);
  #include <colorspace_fragment>
}`;
