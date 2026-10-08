import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import { CitedText } from "./primitives";

const storyOrder = [
  "snow-corrals",
  "tiger-nepal-programme",
  "hawksbill-arnavon",
];
const headlines: Record<string, string> = {
  "snow-corrals": "A fence. A different night.",
  "tiger-nepal-programme": "Space to return.",
  "hawksbill-arnavon": "Protect the nesting shore.",
};
export function ConservationNotes({ data }: { data: BiodiversityDataset }) {
  return (
    <div className="conservation-notes">
      {storyOrder.map((id, i) => {
        const s = data.successStories.find((story) => story.id === id);
        if (!s) throw new Error(`Missing reviewed conservation story: ${id}`);
        return (
          <article key={id} id={`home-${id}`} className="conservation-entry">
            <div className="conservation-heading">
              <p className="eyebrow">
                Field note {String(i + 1).padStart(2, "0")} /{" "}
                {s.kind.replaceAll("-", " ")}
              </p>
              <h3>{headlines[id]}</h3>
              <p className="story-place">{s.geography}</p>
              <em>{s.scientificName}</em>
            </div>
            <div>
              <p className="eyebrow">The action</p>
              <CitedText data={data} claim={s.description} />
            </div>
            <div>
              <p className="eyebrow">The documented outcome</p>
              <CitedText data={data} claim={s.outcome} />
              <div className="inference-limit">
                <p className="eyebrow">The limit</p>
                <p>{s.inferenceLimit}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
