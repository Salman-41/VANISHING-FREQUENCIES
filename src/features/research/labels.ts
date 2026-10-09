import type { ConservationStatus } from "../../../data/schemas/species.schema";

export const conservationLabels: Record<ConservationStatus["category"], string> = {
  LC: "Least Concern", NT: "Near Threatened", VU: "Vulnerable", EN: "Endangered",
  CR: "Critically Endangered", EW: "Extinct in the Wild", EX: "Extinct",
  DD: "Data Deficient", NE: "Not Evaluated",
};
