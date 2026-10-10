import type {
  BiodiversityDataset,
  IndexObservation,
} from "../../../data/schemas/biodiversity.schema";
import { annualPlotScales } from "@/features/observatory/records";
import { indexSeries } from "@/features/research/selectors";
import { Evidence } from "./primitives";

function IndexPlot({
  records,
  mobile,
}: {
  records: IndexObservation[];
  mobile: boolean;
}) {
  const width = mobile ? 270 : 980;
  const height = mobile ? 190 : 290;
  const left = mobile ? 44 : 58;
  const top = 24;
  const { x, y } = annualPlotScales(records, width, height);
  const point = (r: IndexObservation, value: number) =>
    `${(left + x(r.period.endYear)).toFixed(2)},${(top + y(value)).toFixed(2)}`;
  const path = records.map((r) => point(r, r.value!)).join(" ");
  const bounded = records.filter(
    (r) => r.uncertainty?.kind === "source-bounds",
  );
  const bounds = [
    ...bounded.map((r) => point(r, r.uncertainty!.upper)),
    ...[...bounded].reverse().map((r) => point(r, r.uncertainty!.lower)),
  ].join(" ");
  return (
    <svg
      className={mobile ? "index-plot-mobile" : "index-plot-desktop"}
      viewBox={`0 0 ${width + left + 30} ${height + 70}`}
      role="img"
      aria-label="Global Living Planet Index, 2024 edition. Annual estimates decline from 1 in 1970 to about 0.271 in 2020; source bounds surround the line."
    >
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <g key={tick}>
          <path
            className="chart-grid"
            d={`M${left} ${top + y(tick)}h${width}`}
          />
          <text x={left - 12} y={top + y(tick) + 4} textAnchor="end">
            {tick.toFixed(2)}
          </text>
        </g>
      ))}
      <polygon points={bounds} className="chart-bounds" />
      <polyline points={path} className="chart-estimate" />
      {records.map((r) => (
        <circle
          key={r.id}
          cx={left + x(r.period.endYear)}
          cy={top + y(r.value!)}
          r={mobile ? 1.6 : 2.4}
          className="chart-point"
        />
      ))}
      {(mobile
        ? [1970, 1995, 2020]
        : [1970, 1980, 1990, 2000, 2010, 2020]
      ).map((year) => (
        <text
          key={year}
          data-axis-year={year}
          x={left + x(year)}
          y={height + top + 30}
          textAnchor={
            year === 2020 ? "end" : year === 1970 ? "start" : "middle"
          }
        >
          {year}
        </text>
      ))}
    </svg>
  );
}

export function StaticIndexChart({ data }: { data: BiodiversityDataset }) {
  const records = indexSeries(
    data,
    "lpi-2024-owid",
    "lpi-2024-owid-world",
  ).sort((a, b) => a.period.endYear - b.period.endYear);
  if (
    records.length !== 51 ||
    records.some(
      (r) => r.value === null || r.uncertainty?.kind !== "source-bounds",
    )
  )
    throw new Error("The reviewed homepage series is incomplete");
  const final = records.at(-1)!;
  return (
    <div className="index-figure" data-chart="lpi-2024-world">
      <figure>
        <figcaption className="chart-header">
          <span>Global Living Planet Index</span>
          <span>2024 edition / 1970–2020</span>
        </figcaption>
        <p className="chart-unit">Relative index · baseline 1970 = 1</p>
        <IndexPlot records={records} mobile={false} />
        <IndexPlot records={records} mobile />
        <div className="chart-key">
          <span>
            <i className="key-line" />
            Published annual estimates
          </span>
          <span>
            <i className="key-bounds" />
            Published lower / upper bounds
          </span>
        </div>
        <p className="meta">
          2020 index: {final.value}. Source bounds: {final.uncertainty!.lower}–
          {final.uncertainty!.upper}. Confidence level is unverified in the
          acquired metadata.
        </p>
      </figure>
      <p className="meta">
        Straight segments connect published annual estimates; they do not create
        new observations. No species populations or sound levels are derived
        from this index.
      </p>
      <Evidence
        data={data}
        references={[
          {
            sourceId: "owid-lpi-2024",
            locator:
              "Global annual lpi_final, ci_low and ci_high; divided by 100 using source conversionFactor",
          },
        ]}
        verifiedOn={data.verifiedOn}
      />
      <details className="chart-data">
        <summary>Read the annual values and bounds</summary>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Annual index values, horizontally scrollable on small screens"
        >
          <table>
            <caption>
              ZSL / WWF; Our World in Data processing. 2024 edition. Index
              baseline 1970 = 1. Checked {data.verifiedOn}.
            </caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Index</th>
                <th scope="col">Lower bound</th>
                <th scope="col">Upper bound</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.period.endYear}</th>
                  <td>{r.value}</td>
                  <td>{r.uncertainty!.lower}</td>
                  <td>{r.uncertainty!.upper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="meta">
        Figure and data adaptation: CC BY-SA 4.0. ZSL / WWF, Living Planet
        Index; Our World in Data processing; accessed {data.verifiedOn}.{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">License</a>.
      </p>
    </div>
  );
}
