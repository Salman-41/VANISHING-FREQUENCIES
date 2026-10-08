import { ActionLink, Feedback } from "@/components/editorial";
export default function NotFound() {
  return (
    <Feedback title="This page is outside the documentary">
      <p>We could not find that page or species in this collection.</p>
      <div className="actions">
        <ActionLink href="/species" primary>
          Explore the selected species
        </ActionLink>
        <ActionLink href="/">Return to the documentary</ActionLink>
      </div>
    </Feedback>
  );
}
