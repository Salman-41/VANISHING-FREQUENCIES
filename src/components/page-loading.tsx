/** Reserve for optional deferred widgets. Do not wrap the documentary reading path. */
export default function PageLoading() {
  return (
    <section className="feedback" role="status" aria-live="polite">
      <h2>Loading the documentary</h2>
      <p>Preparing the page and its reviewed evidence.</p>
      <div className="loading-aperture" aria-hidden="true" />
    </section>
  );
}
