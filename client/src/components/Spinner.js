const Spinner = ({ label = "Loading…" }) => (
  <div className="spinner-wrap" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true" />
    <span className="spinner-label">{label}</span>
  </div>
);

export default Spinner;
