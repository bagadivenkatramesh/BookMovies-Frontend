export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="center-state" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="muted">{label}</p>
    </div>
  )
}
