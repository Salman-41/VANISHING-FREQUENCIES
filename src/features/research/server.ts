import "server-only";
import { cache } from "react";
import { loadLocalResearch } from "./load-local";

/** Server-only, request-deduplicated access; raw JSON never crosses a client boundary. */
export const getResearch = cache(async () => (await loadLocalResearch(process.cwd())).data);
