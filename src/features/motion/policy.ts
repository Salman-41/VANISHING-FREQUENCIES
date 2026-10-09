/** Conservative fit check: no sticky scene at short heights, zoom, or without real travel. */
export function pinTravel(
  width: number,
  height: number,
  imageHeight: number,
  availableTravel: number,
) {
  if (
    width < 1024 ||
    height < 800 ||
    imageHeight > height - 96 ||
    availableTravel < 80
  )
    return 0;
  return Math.min(height, availableTravel);
}
export const motionTokens = {
  state: 0.16,
  panel: 0.24,
  content: 0.32,
  scene: 0.6,
  entry: 12,
} as const;
