import { ActionLink, Feedback } from "@/components/editorial";
export default function NotFound() {
  return (
    <Feedback title="This page is outside the documentary">
      <p>
        The address may have changed, or this species is not part of the
        documented collection. Use one of these paths to continue.
      </p>
      <div className="actions">
        <ActionLink href="/species" primary>
          Explore the selected species
        </ActionLink>
        <ActionLink href="/data">Open the Biodiversity Observatory</ActionLink>
        <ActionLink href="/soundscapes">Visit the soundscapes</ActionLink>
        <ActionLink href="/sources">Browse the source register</ActionLink>
        <ActionLink href="/">Return to the documentary</ActionLink>
      </div>
    </Feedback>
  );
}
