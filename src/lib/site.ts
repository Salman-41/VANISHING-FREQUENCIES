export const SITE_NAME = "VANISHING FREQUENCIES";
export const TAGLINE = "The World Is Getting Quieter.";

export const siteRoutes = [
  { href: "/", label: "Documentary" },
  { href: "/species", label: "Species Explorer" },
  { href: "/soundscapes", label: "Soundscapes" },
  { href: "/data", label: "Data Observatory" },
  { href: "/about", label: "About" },
  { href: "/sources", label: "Sources" },
  { href: "/credits", label: "Credits" },
] as const;

export const chapters = [
  { id: "opening", label: "The World Is Getting Quieter." },
  { id: "snow-leopard", label: "A life at the edge of sight." },
  { id: "blue-whale", label: "Below the surface." },
  { id: "trends", label: "Read the change. Keep the context." },
  { id: "soundscapes", label: "A place has more than one voice." },
  { id: "species-at-risk", label: "Six lives. Different pressures." },
  { id: "conservation", label: "Change is possible. It happens in places." },
  { id: "closing", label: "There is still a world to hear." },
] as const;
