// Original interpretive shaders. No elevation, acoustic, or population data enters these programs.
// Both draws share a screen-space atmosphere so the transition has no horizon seam.
const atmosphere = /* glsl */ `
vec3 mountainAir(float y) {
  return mix(vec3(0.115, 0.128, 0.125), vec3(0.009, 0.020, 0.029), smoothstep(0.1, 1.0, y));
}
vec3 oceanWater(float y) {
  return mix(vec3(0.002, 0.009, 0.016), vec3(0.022, 0.075, 0.091), pow(y, 1.65));
}
float waterline(vec2 uv, float progress) {
  float level = progress * 1.24 - 0.12;
  float ripple = sin(uv.x * 9.0 + progress * 2.0) * 0.008;
  return smoothstep(uv.y - 0.10, uv.y + 0.10, level + ripple);
}
`;
export const terrainVertex = /* glsl */ `
uniform float uMix;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;
varying float vHeight;
void main() {
  vec4 p = instanceMatrix * vec4(position, 1.0);
  vHeight = position.y;
  p.y = p.y * (1.0 - uMix * 0.86) - uMix * 5.0;
  vec4 world = modelMatrix * p;
  vWorld = world.xyz;
  mat3 basis = mat3(modelMatrix * instanceMatrix);
  vec3 scaleSquared = vec3(dot(basis[0], basis[0]), dot(basis[1], basis[1]), dot(basis[2], basis[2]));
  vec3 surfaceNormal = normal;
  surfaceNormal.y /= 1.0 - uMix * 0.86;
  vNormal = normalize(basis * (surfaceNormal / scaleSquared));
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
uniform float uAspect;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vDepth;
varying float vHeight;
${atmosphere}
void main() {
  vec3 face = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 n = normalize(mix(normalize(vNormal), face, 0.65));
  float light = max(dot(n, normalize(vec3(-0.65, 0.55, 0.4))), 0.0);
  float snow = smoothstep(2.8, 5.0, vHeight + n.x * 0.55) * smoothstep(0.35, 0.75, n.y);
  vec3 stone = mix(vec3(0.006, 0.012, 0.016), vec3(0.075, 0.066, 0.054), light);
  vec3 ice = mix(vec3(0.07, 0.11, 0.15), vec3(0.62, 0.59, 0.49), light);
  vec3 rock = mix(stone, ice, snow);
  rock *= mix(0.3, 1.0, smoothstep(0.3, 2.4, vHeight));
  float band = abs(fract(vHeight * 1.8) - 0.5);
  float contour = 1.0 - smoothstep(0.0, max(fwidth(vHeight * 1.8) * 1.2, 0.025), band);
  rock += contour * 0.007 * (1.0 - snow) * (1.0 - smoothstep(12.0, 45.0, vDepth));
  vec2 uv = vWorld.xz * 0.35;
  float wave = sin(uv.x + sin(uv.y * 1.7 + uTravel)) + sin(uv.y - uv.x * 0.7 - uTravel);
  float caustic = pow(max(0.0, 1.0 - abs(wave)), 7.0);
  vec3 sea = vec3(0.006, 0.033, 0.043) * (0.6 + light) + caustic * vec3(0.012, 0.035, 0.036);
  float ring = 1.0 - smoothstep(0.0, 0.25, abs(length(vWorld.xz - vec2(0.0, -8.0)) - uPulse * 26.0));
  sea += ring * uPulseStrength * vec3(0.08, 0.18, 0.18);
  vec2 screen = gl_FragCoord.xy / vec2(max(1.0, uHeight * uAspect), max(1.0, uHeight));
  float submerged = waterline(screen, uMix);
  vec3 fogColor = mix(mountainAir(screen.y), oceanWater(screen.y), submerged);
  float fog = 1.0 - exp(-max(0.0, vDepth - 12.0) * mix(0.038, 0.18, submerged));
  gl_FragColor = vec4(mix(mix(rock, sea, submerged), fogColor, fog), 1.0);
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
${atmosphere}
void main() {
  vec3 mountain = mountainAir(vUv.y);
  float rayPosition = vUv.x + (1.0 - vUv.y) * 0.24;
  float window = exp(-pow((rayPosition - 0.67) * 3.2, 2.0));
  float shaft = pow(max(0.0, sin(rayPosition * 31.0 + uTravel * 0.12)), 10.0);
  vec3 ocean = oceanWater(vUv.y);
  ocean += (0.35 + shaft * 0.65) * window * pow(vUv.y, 2.5) * vec3(0.012, 0.028, 0.031);
  vec2 radial = (vUv - vec2(0.5, 0.52)) * vec2(uAspect, 1.0);
  float ring = 1.0 - smoothstep(0.0, 0.008, abs(length(radial) - uPulse * 1.2));
  ocean += ring * uPulseStrength * vec3(0.055, 0.12, 0.12);
  // A feathered horizontal waterline carries the editorial aperture into the next environment.
  float submerged = waterline(vUv, uMix);
  gl_FragColor = vec4(mix(mountain, ocean, submerged), 1.0);
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
