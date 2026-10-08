import type { IndexObservation } from "../../../data/schemas/biodiversity.schema";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

/** Future plot coordinates are based only on observed years, never generated values. */
export function annualPlotScales(
  records: IndexObservation[],
  width: number,
  height: number,
) {
  if (!records.length || width <= 0 || height <= 0)
    throw new Error("A plot needs observations and positive dimensions");
  const first = records[0]!;
  if (
    records.some(
      (r) =>
        r.metric !== "relative-index" ||
        r.datasetId !== first.datasetId ||
        r.edition !== first.edition ||
        r.seriesId !== first.seriesId,
    )
  )
    throw new Error("Plot cannot mix editions, datasets, series, or endpoints");
  const years = extent(records, (r) => r.period.endYear);
  const maximum = Math.max(
    1,
    ...records.flatMap((r) => [r.value ?? 0, r.uncertainty?.upper ?? 0]),
  );
  return {
    x: scaleLinear().domain([years[0]!, years[1]!]).range([0, width]),
    y: scaleLinear().domain([0, maximum]).range([height, 0]),
  };
}
